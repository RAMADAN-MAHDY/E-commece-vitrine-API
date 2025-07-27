import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
    responded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

export default ContactMessage ;