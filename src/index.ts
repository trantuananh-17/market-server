import "express-async-errors";
import "src/db";
import express from "express";
import authRouter from "./routes/auth";
import { sendErrorRes } from "./utils/helper";
import "dotenv/config";

const app = express();

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API Routes
app.use("/api/auth", authRouter);

app.use(function (err, req, res, next) {
  sendErrorRes(res, err.message, 500);
} as express.ErrorRequestHandler);

app.listen(process.env.PORT, () => {
  console.log(`The app is running on http://localhost:${process.env.PORT}`);
});
