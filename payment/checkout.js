import { authenticate } from './authenticate.js';
import axios from 'axios';


export async function checkout(order) {
  const token = await authenticate();

  try {
    const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
      auth_token: token,
      delivery_needed: false,
      amount_cents: order.amount_cents,
      currency: 'EGP',
      merchant_order_id: order.merchant_order_id,
      items: order.items || [],
    });

    const paymentKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: token,
      amount_cents: order.amount_cents,
      expiration: 3600,
      order_id: orderRes.data.id,
      billing_data: order.billing_data,
      currency: 'EGP',
      integration_id: process.env.PAYMOB_IID,
    });

    return {
      order_id: orderRes.data.id,
      payment_key: paymentKeyRes.data.token,
    };
  } catch (err) {
    console.error("تفاصيل الخطأ:", err?.response?.data || err.message);
    throw err;
  }
}
