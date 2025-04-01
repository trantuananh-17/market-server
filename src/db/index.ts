import mongoose, { connect } from "mongoose";
import "dotenv/config";

// const uri = `${process.env.MONGO_DB}`;

// connect(uri)
// .then(() => {
//   console.log("db connected succesfully");
// })
// .catch((err) => {
//   console.log("db connection error", err.message);
// });

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`db connected succesfully ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); // exit with failure
  }
};
