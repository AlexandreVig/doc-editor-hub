
import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroapp) => {
  try {
    const mongoDb= process.env.MONGODB_URL ?? "mongodb://localhost:27017/doc-editor"
    await mongoose.connect(mongoDb);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});