import express from 'express';
import User from '../../shema/createuser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';

Dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
// const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const ACCESS_TOKEN_EXPIRY = '7d';
// const REFRESH_TOKEN_EXPIRY = '7d';

// دالة لتوليد توكن الوصول
function generateAccessToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

const createUser = () => { 
    const app = express();
    app.use(express.json());

    app.post('/register', async (req, res) => {
        try {

            const { email, password  , name , rols} = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ message: "جميع الحقول مطلوبة." });
            }

            // const existingUser = await User.findOne({ $or: [{ email }] });

            // if (existingUser) {
            //     return res.status(409).json({ message: "البريد الإلكتروني   مستخدم مسبقًا." });
            // }

            // لتشفير الباسورد
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

           const user = await User.create({ email, password: hashedPassword , name , rols });
 
            if (!user) {
                return res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب." });
            }
            // إنشاء توكن الوصول
            // يمكن إضافة معلومات إضافية في الـ payload إذا لزم الأمر
            // مثل اسم المستخدم أو أي معلومات أخرى
            // const payload = { id: user._id, email: user.email, name: user.name };
            // إذا كنت تريد تضمين الاسم في التوكن
              const {password : _, ...userData } =  user.toObject(); // استبعاد كلمة المرور من البيانات المرسلة
              const payload = { id: user._id, email: user.email };

            const accessToken = generateAccessToken(payload);


            return res.status(201).json({ message: "تم إنشاء الحساب بنجاح" , accessToken , user: userData });

        } catch (err) {
            console.error("خطأ في تسجيل المستخدم:", err);
            return res.status(500).json({ message: "حدث خطأ أثناء تسجيل المستخدم." });
        }
    });

    return app;
};

export default createUser;
