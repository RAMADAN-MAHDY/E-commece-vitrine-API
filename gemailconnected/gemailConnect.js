
import nodemailer from 'nodemailer';
import Dotenv from "dotenv"



Dotenv.config();


// إعداد nodemailer باستخدام حساب Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ramadanmahdy45@gmail.com',
      pass: process.env.GIMAIL_PASS // استخدم كلمة مرور التطبيقات الخاصة بك هنا
    }
  });

  const sendMailbyCommition = async (code)=>{
// console.log(code);

    const mailOptions = {
        from: 'ramadanmahdy45@gmail.com', // عنوان المرسل
        // to: ['ramadanmahdy45@gmail.com' ], 
        bcc: ['ramadanmahdy45@gmail.com', 'ahmedmahdy20105@gmail.com'],// عنوان المستلم (حساب Gmail الخاص بك)
        subject: `  طلب العموله من الكود :/${code}`, // موضوع البريد
        text: `  طلب العموله  بكود ${code}.`, // نص البريد
        html: `
        <h1>  قام بطلب العموله: <strong>${code}</strong>.</h1>
        <p style="
        font-size : 24px ;
        padding: 10px 20px;

        
        ">للاطلاع على التفاصيل، اضغط على الزر أدناه:</p>
        <a href="https://elmahdy.vercel.app/adminahmed" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        ">
            عرض التفاصيل
        </a>

    `
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
        } else {
          console.log('تم إرسال البريد الإلكتروني بنجاح:', info.response);
        }})
  }




  const sendMailbyOrder = async (code ,name)=>{
    const mailOptions = {
        from: 'ramadanmahdy45@gmail.com', // عنوان المرسل
        // to: ['ramadanmahdy45@gmail.com'],
        bcc: ['ramadanmahdy45@gmail.com', 'ahmedmahdy20105@gmail.com'], // عنوان المستلم (حساب Gmail الخاص بك)
        subject: `    طلب اوردر جديد من  ${name} :/${code}`, // موضوع البريد
        text: `     قام بارسال طلب جديد  ${name}.`, // نص البريد
        html: `<p>  اوردر جديد من الكود  : <strong>${code}</strong>.</p>
         <a href="https://elmahdy.vercel.app/adminahmed" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        ">
            عرض التفاصيل
        </a>
        ` // محتوى HTML للبريد
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
        } else {
          console.log('تم إرسال البريد الإلكتروني بنجاح:', info.response);
        }})
  }

  export {sendMailbyOrder};
  export default sendMailbyCommition;