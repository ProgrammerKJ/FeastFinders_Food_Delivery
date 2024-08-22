import mongoose from "mongoose";

export const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI ||
        "mongodb+srv://programmerkj:kZymdczX4AU1QcFI@cluster0.nmf2jak.mongodb.net/food-del";

  try {
    await mongoose.connect(uri);
    console.log(
      `DB Connected to ${
        process.env.NODE_ENV === "test"
          ? "test database"
          : "production database"
      }`
    );
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};
