// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
   name: {
    type: String,
    required: true,
  },
  rols : {
    type: String,
    enum: ['admin', 'user'],
    default: 'user', // القيمة الافتراضية هي 'user'
  },
  password: {
    type: String,
    required: true,
    select: false, // لا يتم إرجاع كلمة المرور في الاستعلامات العادية
  }
});

const User = mongoose.model('User', userSchema);
export default User;