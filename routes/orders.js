// routes/adminOrders.js
import express from 'express';
import OrderModel from '../shema/Orders.js';
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router();

// GET /admin/orders => all orders with filters, sort, and pagination
router.get('/admin/orders', async (req, res) => {
    const {
        userId,
        status,
        sortBy = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 10,
    } = req.query;

const pageNum = Math.max(1, parseInt(page) || 1);
const limitNum = Math.max(1, parseInt(limit) || 10);

    const query = {};

    if (userId) {
        query.userId = userId;
    }

    if (status) {
        query.status = status;
    }


    try {
        const orders = await OrderModel.find(query)
            // .populate('userId', 'name email') // جلب بيانات المستخدم
            .populate('products.productId', 'title image price') // جلب بيانات المنتج
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 }) // ترتيب
            .skip((pageNum - 1) * limitNum) // صفحة
            .limit(limitNum) // عدد الطلبات في الصفحة
            .lean();// 🟢 تحسين الأداء
        const total = await OrderModel.countDocuments(query);

        res.json({
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});


// GET  user orders
router.get('/user/orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;

    const orders = await OrderModel.find({ userId }); // أو حسب اسم الحقل عندك

    res.json({
        userEmail,
        userName,
        orders});
  } catch (error) {
    console.error('خطأ أثناء جلب الطلبات:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
});

// PATCH /admin/orders/:orderId/status => update order status
router.patch('/admin/orders/:orderId/status', authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'failed'];


  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    .populate('products.productId', 'title image price')
    .lean();

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder.status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});



export default router;
