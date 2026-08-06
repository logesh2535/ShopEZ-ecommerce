import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to build dynamic tracking timeline based on current status and order date
const generateTrackingTimeline = (status, orderDate, deliveryDate, deliveryType) => {
  const baseDate = new Date(orderDate || Date.now());
  const expectedDate = deliveryDate ? new Date(deliveryDate) : new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  const steps = [
    {
      stepKey: 'Placed',
      title: 'Order Placed',
      description: 'Your order has been placed successfully and confirmed.',
      location: 'ShopEZ Central Hub',
      timestamp: baseDate,
      completed: true,
      current: status === 'Pending',
    },
    {
      stepKey: 'Processing',
      title: 'Packed & Quality Verified',
      description: 'Seller has processed and packed your items with open-box verification.',
      location: 'Fulfillment Center - Main Dock',
      timestamp: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000), // +4 hours
      completed: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Processing',
    },
    {
      stepKey: 'Shipped',
      title: 'Shipped (In Transit)',
      description: 'Package handed over to ShopEZ Express Logistics courier network.',
      location: 'Regional Sorting Facility',
      timestamp: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000), // +18 hours
      completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Shipped',
    },
    {
      stepKey: 'Out for Delivery',
      title: 'Out for Delivery',
      description: 'Delivery Executive is out with your parcel. Share Delivery OTP upon arrival.',
      location: 'Local Logistics Hub',
      timestamp: new Date(expectedDate.getTime() - 4 * 60 * 60 * 1000), // 4 hours before expected
      completed: ['Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Out for Delivery',
    },
    {
      stepKey: 'Delivered',
      title: 'Delivered Successfully',
      description: 'Item handed over to recipient and verified with OTP.',
      location: 'Customer Address',
      timestamp: expectedDate,
      completed: status === 'Delivered',
      current: status === 'Delivered',
    },
  ];

  return steps;
};

// @desc    Create new order with Flipkart-style delivery scheduling
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      discountAmount,
      taxAmount,
      shippingFee,
      grandTotal,
      deliveryType,
      deliveryDate,
      deliveryTimeSlot,
      deliveryExecutive,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const now = new Date();
    let calculatedDeliveryDate;

    if (deliveryDate) {
      calculatedDeliveryDate = new Date(deliveryDate);
    } else if (deliveryType === 'Express (Next Day)' || deliveryType === 'Open Box Express') {
      calculatedDeliveryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    } else if (deliveryType === 'Scheduled Slot') {
      calculatedDeliveryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 Days default
    } else {
      calculatedDeliveryDate = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // Standard +4 Days
    }

    const initialStatus = 'Pending';
    const trackingTimeline = generateTrackingTimeline(initialStatus, now, calculatedDeliveryDate, deliveryType);

    const order = new Order({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      totalAmount,
      discountAmount: discountAmount || 0,
      taxAmount: taxAmount || 0,
      shippingFee: shippingFee || 0,
      grandTotal,
      status: initialStatus,
      deliveryType: deliveryType || 'Standard',
      deliveryDate: calculatedDeliveryDate,
      deliveryTimeSlot: deliveryTimeSlot || 'Anytime (9:00 AM - 7:00 PM)',
      deliveryExecutive: deliveryExecutive || {
        name: 'Ramesh Kumar',
        phone: '+1 555-0199',
        vehicleNo: 'EZ-EXP-992',
        agentId: 'AGNT-7741',
      },
      courierName: 'ShopEZ Express Logistics',
      trackingTimeline,
    });

    const createdOrder = await order.save();

    // Decrement stock for ordered items
    for (const item of products) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Clear user cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders OR all orders for admin
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization: customer can only view their own order
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Dynamic timeline check to make sure timeline matches current status
    if (!order.trackingTimeline || order.trackingTimeline.length === 0) {
      order.trackingTimeline = generateTrackingTimeline(
        order.status,
        order.createdAt,
        order.deliveryDate,
        order.deliveryType
      );
      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status or delivery details
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryDate, deliveryTimeSlot, deliveryExecutive } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) order.status = status;
      if (deliveryDate) order.deliveryDate = new Date(deliveryDate);
      if (deliveryTimeSlot) order.deliveryTimeSlot = deliveryTimeSlot;
      if (deliveryExecutive) order.deliveryExecutive = { ...order.deliveryExecutive, ...deliveryExecutive };

      order.trackingTimeline = generateTrackingTimeline(
        order.status,
        order.createdAt,
        order.deliveryDate,
        order.deliveryType
      );

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
