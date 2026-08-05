import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create new order
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
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

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
      status: 'Pending',
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

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
