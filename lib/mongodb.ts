import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDB() {
  // 1. Shuruudda halkan ka eeg si TypeScript ay u xaqiijiso in uu yahay string
  if (!MONGODB_URI) {
    throw new Error("Fadlan MONGODB_URI ku dar faylkaaga .env.local");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}