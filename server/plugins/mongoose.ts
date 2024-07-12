import mongoose from "mongoose";

export default defineNitroPlugin(async (nitroapp) => {
  try {
    const mongoDb =
      process.env.MONGODB_URL ?? "mongodb://localhost:27017/doc-editor";
    if (process.env.MONGODB_USER && process.env.MONGODB_PASSWD) {
      const authParams = {
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASSWD,
      };
      await mongoose.connect(mongoDb, authParams);
    } else {
      await mongoose.connect(mongoDb);
    }
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});
