import express from 'express';
import ContactMessage from '../../shema/contactUs.js'; 
import { optionalAuthMiddleware } from '../../middleware/authMiddleware.js'; 

const router = express.Router();

// إرسال رسالة "اتصل بنا" (يتطلب تسجيل دخول)
router.post('/postCuntactUs', optionalAuthMiddleware , async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'نص الرسالة مطلوب' });
    }

    const contact = new ContactMessage({
      userId: req.user ? req.user.id : null,
      name: req.user?.name || name,
      email: req.user?.email || email,
      subject,
      message,
      phone,
    });
// تحقق من البيانات الأساسية لو مش مسجل
    if (!contact.name || !contact.email) {
      return res.status(400).json({ message: 'الاسم والبريد مطلوبان للزوار' });
    }

    await contact.save();

    res.status(200).json({ message: 'تم إرسال الرسالة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء الإرسال', error });
  }
});

export default router;
