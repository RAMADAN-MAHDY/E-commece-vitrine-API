import express from 'express';
import ContactMessage from '../../shema/contactUs.js';
// import authMiddleware from '../../middleware/authMiddleware.js';
// import { isAdmin } from '../../middleware/isAdmin.js'; // احنا لسه كتبينه فوق

const router = express.Router();

// 📨 جلب كل الرسائل للأدمن
router.get('/getContactMessage', async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate('userId', 'name email') // لو فيه مستخدم، هنعرض اسمه وإيميله
      .sort({ createdAt: -1 }); // أحدث رسالة أولًا

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الرسائل', error });
  }
});

export default router;
