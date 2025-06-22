import express from 'express';
import User from '../../../dina_Abaza/shema/createuser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import middleware from '../../middleware/authMiddleware.js'

Dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
// const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const ACCESS_TOKEN_EXPIRY = '7d';
// const REFRESH_TOKEN_EXPIRY = '7d';

// دالة لتوليد توكن الوصول
function generateAccessToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
}


const Login = () => {
    const app = express();
    app.use(express.json());
   // app.use(cookieParser());

    app.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
            }

            const payload = { id: user._id, email: user.email };

            const accessToken = generateAccessToken(payload);

            // خزّن الـ accessToken في كوكي
     //       res.cookie('accessToken', accessToken, {
      //          httpOnly: true,
        //        secure: process.env.NODE_ENV === 'production',
         //       sameSite: 'none',
        //        maxAge: 7 * 24 * 60 * 60 * 1000 // أسبوع بالمللي ثانية
       //     });

            return res.status(200).json({ message: 'تم تسجيل الدخول بنجاح.' , accessToken });
        } catch (err) {
            console.error('خطأ في تسجيل الدخول:', err);
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول.' });
        }
    });
 
    // Middleware للتحقق من صحة التوكن
    app.get('/verify-login', middleware, (req, res) => {

        
    res.json({ message: 'تم تسجيل الدخول بنجاح.' });
});








    app.post('/logout', (req, res) => {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        // res.clearCookie('refreshToken', {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        // });
        return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح.' });
    });






    return app;
};

export default Login;
