import express from 'express';
import User from '../../schema/createuser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

Dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
// const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const ACCESS_TOKEN_EXPIRY = '7d';
// const REFRESH_TOKEN_EXPIRY = '7d';

function generateAccessToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

// function generateRefreshToken(payload) {
//   return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
// }

const Login = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

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
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // أسبوع بالمللي ثانية
            });

            // const refreshToken = generateRefreshToken(payload);
            // res.cookie('refreshToken', refreshToken, {
            //   httpOnly: true,
            //   secure: process.env.NODE_ENV === 'production',
            //   sameSite: 'strict',
            //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
            // });

            return res.status(200).json({ message: 'تم تسجيل الدخول بنجاح.' });
        } catch (err) {
            console.error('خطأ في تسجيل الدخول:', err);
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول.' });
        }
    });

    // app.post('/refresh-token', (req, res) => {
    //   const refreshToken = req.cookies.refreshToken;

    //   if (!refreshToken) {
    //     return res.status(401).json({ message: 'توكن الريفريش مفقود.' });
    //   }

    //   jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    //     if (err) {
    //       return res.status(403).json({ message: 'توكن الريفريش غير صالح.' });
    //     }

    //     const newAccessToken = generateAccessToken({ id: user.id, email: user.email });

    //     res.cookie('accessToken', newAccessToken, {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV === 'production',
    //       sameSite: 'strict',
    //       maxAge: 60 * 60 * 1000 // 1 ساعة
    //     });

    //     return res.status(200).json({ message: 'تم تحديث التوكن.', accessToken: newAccessToken });
    //   });
    // });

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
