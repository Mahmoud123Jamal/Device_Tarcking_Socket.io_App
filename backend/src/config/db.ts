import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI as string;
  try {
    await mongoose.connect(mongoUri);
    console.log("db connected successfully");
  } catch (error) {
    console.error("error", error);
    process.exit(1);
  }
};
