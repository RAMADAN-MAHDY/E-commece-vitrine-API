import express from 'express';
import Product from '../../shema/Productes.js';
import Category from '../../shema/Category.js';
import upload from '../../middleware/multerSetup.js';
import uploadToImgBB from '../../utils/uploadToImgBB.js';


const router = express.Router();

router.patch('/editproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, discountedPrice, categoryId } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'المنتج غير موجود' });

    // تحديث الاسم
    if ('name' in req.body) {
      product.name = name;
    }

    // تحديث التصنيف
    if ('categoryId' in req.body) {
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).json({ msg: 'التصنيف غير موجود' });
      product.categoryId = categoryId;
    }

    // تحديث السعر والخصم
    let updatedPrice = product.price;
    let updatedDiscount = product.offer.discountedPrice;

    if ('price' in req.body) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ msg: 'السعر غير صالح' });
      }
      product.price = parsedPrice;
      updatedPrice = parsedPrice;
    }

    if ('discountedPrice' in req.body) {
      const parsedDiscounted = parseFloat(discountedPrice);
      if (
        !isNaN(parsedDiscounted) &&
        parsedDiscounted > 0 &&
        parsedDiscounted < updatedPrice
      ) {
        product.offer.isActive = true;
        product.offer.discountedPrice = parsedDiscounted;
        product.offer.discountPercent =
          ((updatedPrice - parsedDiscounted) / updatedPrice) * 100;
      } else {
        product.offer.isActive = false;
        product.offer.discountedPrice = updatedPrice;
        product.offer.discountPercent = 0;
      }
    }

    // تحديث الصورة لو اتبعتت صورة جديدة
    if (req.file) {
    // رفع الصورة الجديدة إلى ImgBB
      const { url: imageUrl, deleteUrl } = await uploadToImgBB(req.file.buffer);
      product.image = imageUrl;
      product.imageDeleteUrl = deleteUrl;
    }

    await product.save();

    res.status(200).json({
      msg: 'تم تعديل المنتج بنجاح',
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId,
        offer: product.offer,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: 'حصل خطأ أثناء تعديل المنتج',
      error: err.message,
    });
  }
});

export default router;
