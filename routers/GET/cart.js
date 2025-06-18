import express from 'express';
import Cart from '../../schema/cart.js';


const getCart = ()=>{
const app = express();
app.use(express.json());

app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  res.json(cart || { items: [] });
});


return app;
}
export default getCart;