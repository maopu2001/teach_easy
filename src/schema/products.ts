import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceInPaisa: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});
