// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: String,
  content: String,
  forAll: {
    type: Boolean,
    default: false
  },
  forUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isReadBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
