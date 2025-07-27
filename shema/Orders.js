import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: { // السعر النهائي للمنتج وقت الطلب عشان ميتغيرش لو المنتج اتعدل بعدين
        type: Number,
        required: true
      }
    }
  ],
  amount: { // الإجمالي
    type: Number,
    required: true
  },
 status: {
  type: String,
  enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'failed'],
  default: 'pending'
}
,
  paymentIntentId: { // ممكن تخزن معاه paymentIntent أو sessionId لو حبيت
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
