import express from 'express';
import Product from '../../shema/Productes.js';
import Category from '../../shema/Category.js';

const router = express.Router();

// GET /api/offers?categorySlug=sofa-l&maxPrice=15000&hasOffer=true&limit=10&page=1
router.get('/offers', async (req, res) => {
  try {
    const { categorySlug, maxPrice, hasOffer, limit, page } = req.query;

    const filter = {};

    // لو محدد فئة
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(404).json({ message: 'الفئة غير موجودة' });
      }
      filter.categoryId = category._id;
    }

    // فلترة بالسعر بعد الخصم لو فيه maxPrice
    if (maxPrice) {
      const cleanedPrice = maxPrice.replace(/\s+/g, '').replace(/,/g, '');
      const price = Number(cleanedPrice);

      if (isNaN(price)) {
        return res.status(400).json({ message: 'قيمة السعر غير صالحة' });
      }

      filter['offer.discountedPrice'] = { $lte: price };
    }

    // فلترة المنتجات اللي عليها عروض فقط
    if (hasOffer === 'true') {
      filter['offer.isActive'] = true;
    }

    // إعدادات الـ pagination
    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .populate('categoryId', 'name slug')
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Product.countDocuments(filter);

    res.json({
      total: totalCount,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      products,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات' });
  }
});

export default router;
