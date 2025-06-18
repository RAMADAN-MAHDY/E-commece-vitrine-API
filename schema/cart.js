import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: String,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;