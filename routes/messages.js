import jwt from 'jsonwebtoken';
import express from 'express';
import Message from '../shema/Message.js';
import middleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

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

// حذف الرساله من اليوزر
router.delete('/delete_message/:id', middleware , async (req, res) => {
    const messageId = req.params.id;
  
    try {
      //   await Message.updateMany(
      //       { deletedBy: { $exists: false } },
      //       { $set: { deletedBy: [] } }
      //     );
          
      const userId = req.user.id;
  
      console.log('User ID:', userId);
      console.log('Message ID:', messageId);
  
      const message = await Message.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ message: "الرسالة غير موجودة" });
      }
  
      // تحقق من أن المستخدم هو صاحب الرسالة أو أن الرسالة عامة
      if (message.forAll) {
          // لو الرسالة عامة، سجل أن اليوزر حذفها عنده
          message.deletedBy = message.deletedBy || [];
          if (!message.deletedBy.includes(userId)) {
            message.deletedBy.push(userId);
            await message.save();
          }
          return res.status(200).json({ message: "تم حذف الرسالة بنجاح" });
        } else {
          // لو الرسالة خاصة بيه، امسحها عادي
          await Message.findByIdAndDelete(messageId);
          return res.status(200).json({ message: "تم حذف الرسالة بنجاح" });
        }
        
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "حدث خطأ أثناء حذف الرسالة" });
    }
  });


// الحصول على الرسائل   

router.get('/Get_messages', async (req, res) => {
    let userId = null;
  
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        userId = decoded.id;
      } catch (err) {
          return res.status(401).json({ message: "توكن غير صالح" });
      }
    }
  
    try {
      const filter = userId
      ? { 
          $or: [
            { forAll: true, deletedBy: { $ne: userId } }, 
            { forUser: userId }
          ] 
        }
      : { forAll: true };
      
      const messages = await Message.find(filter).sort({ createdAt: -1 });
      
      // console.log(userId);
      res.json({ messages});
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الرسائل' });
    }
  });
  




export default router;
