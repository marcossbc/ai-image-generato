import mongoose, { Schema, model, models } from "mongoose";

const GenerationSchema = new Schema(
  {
    userEmail: { type: String, required: true, index: true }, 
    prompt: { type: String, required: true },
    images: [{ type: String, required: true }],
    ratio: { type: String, default: "1:1" },
  },
  { timestamps: true }
);

export default models.Generation || model("Generation", GenerationSchema);