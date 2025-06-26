import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Product from '../shema/Productes.js';
import OrderModel from '../shema/Orders.js'

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
const { cartItems, userId } = req.body;

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: 'منتج غير موجود' });

      const finalPrice = product.offer.isActive
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
      status: 'pending'
    });



  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderProducts.map(p => ({
        price_data: {
          currency: 'usd',
          product_data: { name: 'منتج' },
          unit_amount: Math.round(p.price * 100)
        },
        quantity: p.quantity
      })),
      mode: 'payment',
      success_url: 'https://elmahdy.vercel.app?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://elmahdy.vercel.app/cancel',
      metadata: {
        orderId: order._id.toString()
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Error:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء جلسة الدفع' });
  }
});



router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    // استخراج البيانات اللي انت محتاج الفرونت يشوفها بس
    const responseData = {
      amountPaid: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      customerName: session.customer_details?.name || 'غير معروف',
      customerEmail: session.customer_details?.email || 'غير معروف',
      orderId: session.metadata?.orderId || null,
    };

    res.json(responseData);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'فشل في جلب بيانات الجلسة' });
  }
});












export default router;
