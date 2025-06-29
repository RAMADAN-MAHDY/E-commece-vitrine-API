import express from 'express';
import Product from '../shema/Productes.js';
import OrderModel from '../shema/Orders.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/cash-on-delivery
 * @desc    تسجيل طلب جديد للدفع عند الاستلام
 * @access  Protected (requires JWT)
 */
router.post('/cash-on-delivery', authMiddleware, async (req, res) => {
  try {
    const { cartItems } = req.body;
    console.log('User:', req.user);
    console.log('Cart Items:', cartItems);

    const userId = req.user.id;
    if (!Array.isArray(cartItems) || !userId) {
      return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
    }
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `منتج غير موجود: ${item.productId}` });

      const finalPrice = product.offer?.isActive
        ? product.offer.discountedPrice
        : product.price;

      const itemTotal = finalPrice * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: finalPrice
      });
    }

    const order = await OrderModel.create({
      userId,
      products: orderProducts,
      amount: totalAmount,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'تم تسجيل الطلب بنجاح. سيتم الدفع عند الاستلام.',
      orderId: order._id,
      amount: totalAmount,
      products: orderProducts
    });
  } catch (err) {
    console.error('❌ Cash on Delivery Error:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الطلب' });
  }
});

export default router;
