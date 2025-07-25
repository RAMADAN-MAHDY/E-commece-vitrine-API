import express from 'express';
import jwt from 'jsonwebtoken';
import Message from '../../shema/Message.js';
import dotenv from 'dotenv';
import authMiddleware from '../../middleware/authMiddleware.js';
dotenv.config();

const router = express.Router();

router.delete('/delete_message/:id', authMiddleware , async (req, res) => {
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

export default router;
