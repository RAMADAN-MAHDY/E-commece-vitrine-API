import jwt from 'jsonwebtoken';
import express from 'express';
import Message from '../../shema/Message.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

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
