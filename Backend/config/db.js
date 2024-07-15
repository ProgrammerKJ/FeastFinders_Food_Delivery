import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://programmerkj:kZymdczX4AU1QcFI@cluster0.nmf2jak.mongodb.net/food-del"
    )
    .then(() => console.log("DB Connected"));
};
