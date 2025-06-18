import express from 'express';
import Cart from '../../schema/cart.js';
import authMiddleware from '../../middleware/authMiddleware.js';



const postCart = () => {

  const app = express();
  app.use(express.json());

  app.post('/cart/add',authMiddleware,  async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      // تحقق من القيم المطلوبة
      if (!userId || !productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'userId, productId و quantity مطلوبين و quantity لازم يكون أكبر من 0.' });
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // لو مفيش سلة، أنشئ واحدة
        cart = await Cart.create({
          userId,
          items: [{ productId, quantity }]
        });
      } else {
        // لو فيه سلة، حدثها
        const itemIndex = cart.items.findIndex(i => i.productId === productId);
        if (itemIndex > -1) {
          // المنتج موجود، زود الكمية
          cart.items[itemIndex].quantity += quantity;
        } else {
          // المنتج مش موجود، ضيفه
          cart.items.push({ productId, quantity });
        }
        await cart.save();
      }

      return res.status(200).json({ message: 'تمت إضافة المنتج للسلة بنجاح.', cart });

    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء إضافة المنتج للسلة.' });
    }
  });

  return app;
};

export default postCart;
