import express from 'express';
import User from '../../shema/createuser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';
import middleware from '../../middleware/authMiddleware.js'
import adminMiddleware from '../../middleware/adminMiddleware.js';

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

            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ message: "جميع الحقول مطلوبة." });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "البريد الإلكتروني مستخدم مسبقًا." });
            }

            // لتشفير الباسورد
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = await User.create({ email, password: hashedPassword, name });

            if (!user) {
                return res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب." });
            }
            // إنشاء توكن الوصول
            // يمكن إضافة معلومات إضافية في الـ payload إذا لزم الأمر
            // مثل اسم المستخدم أو أي معلومات أخرى
            // const payload = { id: user._id, email: user.email, name: user.name };
            // إذا كنت تريد تضمين الاسم في التوكن
            const { password: _, ...userData } = user.toObject(); // استبعاد كلمة المرور من البيانات المرسلة
            const payload = { id: user._id, name: user.name, rols : user.rols , email: user.email };

            const accessToken = generateAccessToken(payload);


            return res.status(201).json({ message: "تم إنشاء الحساب بنجاح", accessToken, user: userData });

        } catch (err) {
            console.error("خطأ في تسجيل المستخدم:", err);
            return res.status(500).json({ message: "حدث خطأ أثناء تسجيل المستخدم." });
        }
    });


    // إضافة أدمن جديد (مفتوح فقط للأدمن الحاليين)
    app.post('/add-admin', middleware, adminMiddleware, async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'يرجى ملء جميع الحقول.' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'البريد الإلكتروني مستخدم من قبل.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new User({
                name,
                email,
                password: hashedPassword,
                rols: 'admin'
            });

            await newAdmin.save();

            res.status(201).json({ message: 'تم إضافة الأدمن بنجاح.' });
        } catch (err) {
            console.error('خطأ أثناء إضافة الأدمن:', err);
            res.status(500).json({ message: 'حدث خطأ أثناء إضافة الأدمن.' });
        }
    });



    // تعديل صلاحية مستخدم (تحويل من admin إلى user والعكس)
    app.put('/update-role/:id', middleware, adminMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            const { newRole } = req.body;

            if (!['user', 'admin'].includes(newRole)) {
                return res.status(400).json({ message: 'الصلاحية الجديدة غير صالحة.' });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'المستخدم غير موجود.' });
            }

            user.rols = newRole;
            await user.save();

            res.status(200).json({ message: `تم تغيير صلاحية المستخدم إلى ${newRole} بنجاح.` });
        } catch (err) {
            console.error('خطأ أثناء تعديل صلاحية المستخدم:', err);
            res.status(500).json({ message: 'حدث خطأ أثناء تعديل الصلاحية.' });
        }
    });





    return app;
};

export default createUser;
