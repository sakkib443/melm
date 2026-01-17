// ===================================================================
// CreativeHub LMS - Stats Service
// Real-time statistics from database
// ===================================================================

import { User } from '../user/user.model';
import { Course } from '../course/course.model';
import { Website } from '../website/website.model';
import { Software } from '../software/software.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { Review } from '../review/review.module';
import { Order } from '../order/order.module';
import { Graphics } from '../graphics/graphics.model';
import { Download } from '../download/download.module';
import { Wishlist } from '../wishlist/wishlist.module';
import { Types } from 'mongoose';

/**
 * Get comprehensive dashboard stats from database
 */
const getDashboardStats = async () => {
    try {
        // Date calculations
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // ==================== REVENUE STATS ====================
        // Today's revenue
        const todayRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    orderDate: { $gte: todayStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Monthly revenue
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    orderDate: { $gte: monthStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Total revenue (all time)
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // ==================== MONTHLY REVENUE CHART DATA ====================
        // Get last 12 months revenue for chart
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueChartData = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const monthRevenue = await Order.aggregate([
                {
                    $match: {
                        paymentStatus: 'completed',
                        orderDate: { $gte: date, $lt: nextMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);

            revenueChartData.push({
                label: monthNames[date.getMonth()],
                value: monthRevenue[0]?.total || 0
            });
        }

        // ==================== ORDER STATS ====================
        const totalOrders = await Order.countDocuments({ paymentStatus: 'completed' });
        const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
        const todayOrders = await Order.countDocuments({
            paymentStatus: 'completed',
            orderDate: { $gte: todayStart }
        });
        const monthlyOrders = await Order.countDocuments({
            paymentStatus: 'completed',
            orderDate: { $gte: monthStart }
        });

        // Recent orders for dashboard
        const recentOrders = await Order.find({ paymentStatus: 'completed' })
            .populate('user', 'firstName lastName email')
            .sort({ orderDate: -1 })
            .limit(5)
            .lean();

        // ==================== USER STATS ====================
        const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
        const totalSellers = await User.countDocuments({
            role: { $in: ['seller', 'mentor', 'admin'] },
            isDeleted: { $ne: true }
        });
        const totalBuyers = await User.countDocuments({
            role: { $in: ['user', 'student'] },
            isDeleted: { $ne: true }
        });
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: monthStart },
            isDeleted: { $ne: true }
        });

        // ==================== PRODUCT STATS ====================
        const totalCourses = await Course.countDocuments({});
        const totalWebsites = await Website.countDocuments({ isDeleted: { $ne: true } });
        const totalSoftware = await Software.countDocuments({ isDeleted: { $ne: true } });
        const totalGraphics = await Graphics.countDocuments({ isDeleted: { $ne: true } });
        const totalEnrollments = await Enrollment.countDocuments({});

        // Reviews stats
        const reviewStats = await Review.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
        ]);

        const avgRating = reviewStats.length > 0 ? reviewStats[0].avgRating : 4.8;
        const totalReviews = reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;

        // Total products
        const totalProducts = totalCourses + totalWebsites + totalSoftware + totalGraphics;

        return {
            // Revenue
            todayRevenue: todayRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            totalRevenue: totalRevenue[0]?.total || 0,
            revenueChartData,

            // Orders
            totalOrders,
            pendingOrders,
            completedOrders: totalOrders,
            todayOrders,
            monthlyOrders,
            recentOrders: recentOrders.map(order => ({
                id: order.orderNumber,
                customer: order.user ? `${(order.user as any).firstName} ${(order.user as any).lastName || ''}`.trim() : 'Unknown',
                product: order.items[0]?.title || 'Product',
                amount: order.totalAmount,
                status: order.paymentStatus
            })),

            // Users
            totalUsers,
            totalSellers,
            totalBuyers,
            newUsersThisMonth,

            // Products
            totalProducts,
            totalCourses,
            totalGraphics: totalGraphics,
            totalVideos: 0,
            totalUIKits: 0,
            totalApps: 0,
            totalAudio: 0,
            totalPhotos: 0,
            totalFonts: 0,
            totalLikes: 0,

            // Other
            totalEnrollments,
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews,

            // Breakdown for charts
            breakdown: {
                courses: totalCourses,
                websites: totalWebsites,
                software: totalSoftware,
                graphics: totalGraphics,
                users: totalUsers,
                enrollments: totalEnrollments,
                reviews: totalReviews
            }
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return {
            todayRevenue: 0,
            monthlyRevenue: 0,
            totalRevenue: 0,
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            todayOrders: 0,
            monthlyOrders: 0,
            recentOrders: [],
            totalUsers: 0,
            totalSellers: 0,
            totalBuyers: 0,
            newUsersThisMonth: 0,
            totalProducts: 0,
            totalCourses: 0,
            totalGraphics: 0,
            totalVideos: 0,
            totalUIKits: 0,
            totalApps: 0,
            totalAudio: 0,
            totalPhotos: 0,
            totalFonts: 0,
            totalLikes: 0,
            totalEnrollments: 0,
            avgRating: 0,
            totalReviews: 0,
            breakdown: {
                courses: 0,
                websites: 0,
                software: 0,
                graphics: 0,
                users: 0,
                enrollments: 0,
                reviews: 0
            }
        };
    }
};

/**
 * Get user-specific statistics
 */
const getUserStats = async (userId: string) => {
    try {
        const userObjId = new Types.ObjectId(userId);

        const [
            totalOrders,
            totalDownloads,
            wishlistDoc,
            totalEnrollments,
            totalReviews,
            spendingResult
        ] = await Promise.all([
            Order.countDocuments({ user: userObjId, paymentStatus: 'completed' }),
            Download.countDocuments({ user: userObjId }),
            Wishlist.findOne({ user: userObjId }),
            Enrollment.countDocuments({ student: userObjId }),
            Review.countDocuments({ user: userObjId }),
            Order.aggregate([
                { $match: { user: userObjId, paymentStatus: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        return {
            orders: totalOrders,
            downloads: totalDownloads,
            wishlist: wishlistDoc?.items?.length || 0,
            courses: totalEnrollments,
            reviews: totalReviews,
            totalSpent: spendingResult[0]?.total || 0
        };
    } catch (error) {
        console.error('Error getting user stats:', error);
        return {
            orders: 0,
            downloads: 0,
            wishlist: 0,
            courses: 0,
            reviews: 0,
            totalSpent: 0
        };
    }
};

export const StatsService = {
    getDashboardStats,
    getUserStats
};
