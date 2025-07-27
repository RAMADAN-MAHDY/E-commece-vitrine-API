import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    offer: {
      isActive: { type: Boolean, default: false },
      discountPercent: { type: Number, default: 0 },
      discountedPrice: { type: Number, default: 0 }
    },
    image: { type: String, required: true },
    imageDeleteUrl: { type: String, default: '' },
    categoryId: { type: Types.ObjectId, required: true, ref: 'Category' }
  },
  {
    timestamps: true 
  }
);
productSchema.index({ name: "text", description: "text" });

const Product = model('Product', productSchema);
export default Product;
