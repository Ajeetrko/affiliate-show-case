import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  image: { type: String, required: true },
  amazonLink: { type: String, required: true },
  price: { type: Number, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
