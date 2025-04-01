import "express-async-errors";
import "src/db";
import express from "express";
import authRouter from "./routes/auth";
import { sendErrorRes } from "./utils/helper";
import "dotenv/config";
import formidable from "formidable";
import path from "path";
import productRouter from "./routes/product";
import { connectDB } from "src/db";
import job from "./render";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API Routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

// Cách upload file
app.post("/upload-file", async (req, res) => {
  const form = formidable({
    uploadDir: path.join(__dirname, "public"),
    filename(name, ext, part, form) {
      return Date.now() + "_" + part.originalFilename;
    },
  });
  await form.parse(req);
  res.send("ok");
});

app.use(function (err, req, res, next) {
  sendErrorRes(res, err.message, 500);
} as express.ErrorRequestHandler);

// app.listen(process.env.PORT, () => {
//   console.log(`The app is running on http://localhost:${process.env.PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
