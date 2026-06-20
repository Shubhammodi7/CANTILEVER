import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      family: 4,
    });

    console.log("Database Connected");
  } catch (error) {
    console.log("Failed to connect to DB ", error);
  }
};

export default connectToDb;
