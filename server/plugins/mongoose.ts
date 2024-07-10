
import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroapp) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongoUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});