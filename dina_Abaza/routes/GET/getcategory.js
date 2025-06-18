import express from 'express';
import CategoryModel from '../../shema/Category.js';

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
  }
});

export default router;
