import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    const totalCustomersCount = await User.countDocuments({ role: 'customer' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Stock alerts (products with stock <= 5)
    const stockAlerts = await Product.find({ stock: { $lte: 5 } }).select('name stock category price images');

    // Top selling products / featured
    const topProducts = await Product.find({}).sort({ rating: -1, reviewsCount: -1 }).limit(5);

    // Monthly Sales mock / aggregate data
    const monthlySales = [
      { month: 'Jan', sales: 4200 },
      { month: 'Feb', sales: 5800 },
      { month: 'Mar', sales: 7100 },
      { month: 'Apr', sales: 6400 },
      { month: 'May', sales: 8900 },
      { month: 'Jun', sales: 11200 },
      { month: 'Jul', sales: 9800 },
      { month: 'Aug', sales: 12500 },
    ];

    // Category breakdown
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: totalOrdersCount,
      totalProducts: totalProductsCount,
      totalCustomers: totalCustomersCount,
      monthlySales,
      categoryStats,
      recentOrders,
      stockAlerts,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
