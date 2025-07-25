import express from 'express';
import Product from '../../shema/Productes.js';
import deleteFromImgBB from '../../utils/deleteFromImgBB.js';
import middleware from '../../middleware/authMiddleware.js'
import adminMiddleware from '../../middleware/adminMiddleware.js';

const router = express.Router();

router.delete('/deleteproduct/:id', middleware, adminMiddleware , async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: 'المنتج غير موجود' });
    }

    // حذف الصورة من ImgBB لو فيه رابط حذف
    if (product.imageDeleteUrl) {
      await deleteFromImgBB(product.imageDeleteUrl);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ msg: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: 'حصل خطأ أثناء حذف المنتج',
      error: err.message,
    });
  }
});

export default router;
