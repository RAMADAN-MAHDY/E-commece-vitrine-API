import express from 'express';
import User from '../shema/createuser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';
import middleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js';
// import router from './messages.js';

Dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
// const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const ACCESS_TOKEN_EXPIRY = '7d';
// const REFRESH_TOKEN_EXPIRY = '7d';

// دالة لتوليد توكن الوصول
function generateAccessToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

    const router = express.Router();

    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' });
            }

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
            }

            const payload = { id: user._id, name: user.name, rols : user.rols , email: user.email };

            const accessToken = generateAccessToken(payload);

            if (user.rols === "admin") {
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // أسبوع بالمللي ثانية
                });
            }
            // خزّن الـ accessToken في كوكي

            const { password: _, ...userData } = user.toObject(); // استبعاد كلمة المرور من البيانات المرسلة

            if (user.rols !== 'admin') {
                return res.status(200).json({ message: 'تم تسجيل الدخول بنجاح.', accessToken, user: userData });
            }

            return res.status(200).json({ message: 'تم تسجيل الدخول كأدمن بنجاح.', user: userData });

        } catch (err) {
            console.error('خطأ في تسجيل الدخول:', err);
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول.' });
        }
    });

    // Middleware للتحقق من صحة التوكن
    router.get('/verify-login', middleware, (req, res) => {
        res.json({ message: 'تم تسجيل الدخول بنجاح.' });
    });
    // admin
    router.get('/verify-login-admin', middleware, adminMiddleware , (req, res) => {
        res.json({ message:'تم تسجيل الدخول كأدمن بنجاح.'});
    });

// مسار تسجيل الخروج    
    router.post('/logout', (req, res) => {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
          });
          
        return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح.' });
    });


export default router;
