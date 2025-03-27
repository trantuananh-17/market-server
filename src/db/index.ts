import { connect } from "mongoose";
import "dotenv/config";

const uri = `${process.env.MONGO_DB}`;

connect(uri)
  .then(() => {
    console.log("db connected succesfully");
  })
  .catch((err) => {
    console.log("db connection error", err.message);
  });
