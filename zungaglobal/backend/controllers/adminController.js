import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Get monthly revenue
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: monthEnd },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      trackQuantity: true,
      quantity: { $lte: 5 }
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top selling products
    const topProducts = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name salesCount price images');

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          todayOrders,
          todayRevenue: todayRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          lowStockProducts,
          newUsers
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days = 30;

    if (period === '7d') days = 7;
    if (period === '90d') days = 90;
    if (period === '1y') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sales data by date
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          revenue: { $sum: '$items.total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        revenueByCategory,
        period
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics'
    });
  }
};