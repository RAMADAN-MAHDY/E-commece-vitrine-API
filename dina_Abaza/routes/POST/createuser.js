import express from 'express';
import User from '../../schema/createuser.js';
import bcrypt from 'bcryptjs';

const createUser = () => { 
    const app = express();
    app.use(express.json());

    app.post('/signup', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "جميع الحقول مطلوبة." });
            }

            const existingUser = await User.findOne({ $or: [{ email }] });

            if (existingUser) {
                return res.status(409).json({ message: "البريد الإلكتروني أو الرمز مستخدم مسبقًا." });
            }

            // لتشفير الباسورد
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await User.create({ email, password: hashedPassword });
            return res.status(201).json({ message: "تم إنشاء الحساب بنجاح", user: newUser });

        } catch (err) {
            console.error("خطأ في تسجيل المستخدم:", err);
            return res.status(500).json({ message: "حدث خطأ أثناء تسجيل المستخدم." });
        }
    });

    return app;
};

export default createUser;
