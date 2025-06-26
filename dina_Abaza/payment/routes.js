import express from 'express';
import dotenv from 'dotenv';
import paymob from './paymob.js';

dotenv.config();
const router = express.Router();

router.post('/pay', async (req, res) => {
  try {
    const { amount_cents, billing_data, items } = req.body;
    console.log("📩 الطلب المستلم من Postman:", req.body);

    const token = await paymob.authenticate();
    console.log("🔐 التوكن:", token);

    const order = {
      amount_cents,
      merchant_order_id: `ORDER-${Date.now()}`,
      billing_data,
      items,
    };

    const orderRes = await paymob.createOrder(token, order);
    console.log("🧾 orderRes:", orderRes);

    const paymentKey = await paymob.getPaymentKey(token, {
      amount_cents,
      order_id: orderRes.id,
      billing_data,
    });
    console.log("🔑 paymentKey:", paymentKey);

    const iframeSrc = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ iframeSrc });
  } catch (err) {
    console.error("❌ خطأ أثناء إنشاء الطلب:", err?.response?.data || err.message);
    res.status(500).json({ error: 'فشل في إنشاء الطلب' });
  }
});


export default router;
