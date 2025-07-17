import express from 'express';

import users from '../../shema/createuser.js';


const router = express.Router();

router.get('/Users', async (req, res) => {
    try {
        const ALL_Users =await users.find();

        if (ALL_Users.length === 0) {
            return res.status(404).json({ message: "لا يوجد مستخدمين" })
        }

     res.json({ALL_Users :ALL_Users })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات' })


    }
})

export default router;