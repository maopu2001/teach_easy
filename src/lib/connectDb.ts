import { initializeSchemas } from "@/schema";
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  let cached = (
    global as typeof globalThis & {
      mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
    }
  ).mongoose;

  if (!cached) {
    cached = (
      global as typeof globalThis & {
        mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
      }
    ).mongoose = {
      conn: null,
      promise: null,
    };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        initializeSchemas();
        return mongoose;
      })
      .catch((err) => {
        console.error(
          "There is an error while connecting to MongoDB:",
          err.message
        );
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
