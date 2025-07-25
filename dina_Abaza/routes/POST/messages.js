// routes/messages.js
import express from 'express';
import Message from '../../shema/Message.js';
import middleware from '../../middleware/authMiddleware.js'
import adminMiddleware from '../../middleware/adminMiddleware.js';

const router = express.Router();

// إرسال رسالة جديدة (من الأدمن)
router.post('/messages',middleware, adminMiddleware , async (req, res) => {
  try {
    const { title, content, forUser, forAll } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'العنوان والمحتوى مطلوبين' });
    }

    const message = new Message({
      title,
      content,
      forUser: forAll ? null : forUser,
      forAll: !!forAll
    });

    await message.save();

    res.status(201).json({ message: 'تم إرسال الرسالة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إرسال الرسالة', error: error.message });
  }
});

export default router;
