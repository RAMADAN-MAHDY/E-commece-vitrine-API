import mongoose from 'mongoose';
import Dotenv from 'dotenv';


Dotenv.config()

const uri = process.env.MONGO_DB;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);

// Uncomment the following lines if you want to drop a specific index

// await mongoose.connection.collection('users').dropIndex('email_1');

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
