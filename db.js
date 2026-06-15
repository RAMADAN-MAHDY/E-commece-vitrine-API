import mongoose from 'mongoose';
import Dotenv from 'dotenv';


Dotenv.config()

const uri = process.env.MONGO_DB;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    const opts = {
      bufferCommands: true, // Mongoose defaults to true, but good to be explicit
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('MongoDB connected');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Error connecting to MongoDB:', e);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
