import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true 
}
); 

const Category = model('Category', categorySchema);
export default Category;
