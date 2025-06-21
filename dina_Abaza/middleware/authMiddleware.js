import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'التوكن مفقود. الدخول مرفوض' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'التوكن غير صالح أو منتهي' });
    }

    req.user = decoded; // تخزن بيانات المستخدم في الطلب
    next(); // كمل للراوت
  });
}

export default authMiddleware;
