import express from 'express';
import Product from '../../shema/Productes.js';
import Category from '../../shema/Category.js';
import upload from '../../middleware/multerSetup.js';
import uploadToImgBB from '../../utils/uploadToImgBB.js';

const router = express.Router();

router.post('/addproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, price, discountedPrice, categoryId } = req.body;

    // تحقق من الحقول الأساسية
    if (!name || !price || !categoryId) {
      return res.status(400).json({ msg: 'الاسم، السعر، والتصنيف مطلوبين' });
    }

    // تحقق إن السعر أرقام
    const priceNum = parseFloat(price);
    const discountedPriceNum = parseFloat(discountedPrice);

    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ msg: 'السعر غير صالح' });
    }

    // تحقق إن الـ Category موجود
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'التصنيف غير موجود' });
    }

    // رفع الصورة
    if (!req.file) {
      return res.status(400).json({ msg: 'الصورة مطلوبة' });
    }

    const { url: imageUrl, deleteUrl } = await uploadToImgBB(req.file.buffer);


    // منطق الخصم
    let isActive = false;
    let finalDiscountedPrice = priceNum;
    let discountPercent = 0;

    if (discountedPriceNum && discountedPriceNum < priceNum) {
      isActive = true;
      finalDiscountedPrice = discountedPriceNum;
      discountPercent = ((priceNum - discountedPriceNum) / priceNum) * 100;
    }

    // إنشاء المنتج
    const newProduct = await Product.create({
      name,
      price: priceNum,
      image: imageUrl,
      imageDeleteUrl: deleteUrl,
      categoryId,
      offer: {
        isActive,
        discountPercent,
        discountedPrice: finalDiscountedPrice
      }
    });

    res.status(201).json(newProduct);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'حصل خطأ أثناء إضافة المنتج', error: err.message });
  }
});

export default router;
