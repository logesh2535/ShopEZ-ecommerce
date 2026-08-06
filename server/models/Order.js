import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery', 'UPI / NetBanking'],
      default: 'Credit Card',
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryType: {
      type: String,
      enum: ['Standard', 'Express (Next Day)', 'Scheduled Slot', 'Open Box Express'],
      default: 'Standard',
    },
    deliveryDate: {
      type: Date,
    },
    deliveryTimeSlot: {
      type: String,
      default: 'Anytime (9:00 AM - 7:00 PM)',
    },
    deliveryOTP: {
      type: String,
    },
    deliveryExecutive: {
      name: { type: String, default: 'Ramesh Kumar' },
      phone: { type: String, default: '+1 555-0199' },
      vehicleNo: { type: String, default: 'EZ-EXP-992' },
      agentId: { type: String, default: 'AGNT-7741' },
    },
    courierName: {
      type: String,
      default: 'ShopEZ Express Logistics',
    },
    trackingNumber: {
      type: String,
    },
    trackingTimeline: [
      {
        stepKey: String,
        title: String,
        description: String,
        location: String,
        timestamp: Date,
        completed: Boolean,
        current: Boolean,
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = 'SEZ-' + Math.floor(100000 + Math.random() * 900000);
  }
  if (!this.deliveryOTP) {
    this.deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();
  }
  if (!this.trackingNumber) {
    this.trackingNumber = 'SEZLOG' + Math.floor(10000000 + Math.random() * 90000000);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
