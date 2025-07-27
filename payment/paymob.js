import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'https://accept.paymob.com/api';

async function authenticate() {
    try {

    console.log("🔑 PAYMOB_API_KEY:", process.env.PAYMOB_API_KEY);

    const res = await axios.post(`${API_BASE}/auth/tokens`, {
      api_key: process.env.PAYMOB_API_KEY,
    });
    console.log("🔐 Response كامل من Paymob:", res.data);
    return res.data.token;
  } catch (err) {
    console.error("خطأ أثناء التوثيق:", err?.response?.data || err.message);
    throw err;
  }
}


async function createOrder(token, order) {
  try {
    const res = await axios.post(`${API_BASE}/ecommerce/orders`, {
      auth_token: token,
      delivery_needed: false,
      amount_cents: order.amount_cents,
      currency: 'EGP',
      merchant_order_id: order.merchant_order_id,
      items: order.items || [],
    });
    return res.data;
  } catch (err) {
    console.error("خطأ أثناء إنشاء الطلب:", err?.response?.data || err.message);
    throw err;
  }
}

async function getPaymentKey(token, paymentData) {
  try {
    const res = await axios.post(`${API_BASE}/acceptance/payment_keys`, {
      auth_token: token,
      amount_cents: paymentData.amount_cents,
      expiration: 3600,
      order_id: paymentData.order_id,
      billing_data: paymentData.billing_data,
      currency: 'EGP',
      integration_id: process.env.PAYMOB_IID,
    });
    return res.data.token;
  } catch (err) {
    console.error("خطأ أثناء الحصول على payment key:", err?.response?.data || err.message);
    throw err;
  }
}

export default {
  authenticate,
  createOrder,
  getPaymentKey,
};
