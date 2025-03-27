import { RequestHandler } from "express";
import crypto from "crypto";
import AuthVerificationToken from "src/models/authVerificationToken";
import "dotenv/config";
import mail from "src/utils/mail";

export const GenerateVertificationLink: RequestHandler = async (req, res) => {
  // Đọc dữ liệu: id và token
  const { id } = req.body;
  const token = crypto.randomBytes(36).toString("hex");

  const link = `${process.env.API_URL}/verify.html?id=${id}&token=${token}`;

  await AuthVerificationToken.findOneAndDelete({ owner: id });
  // Tạo/lưu token mới và gửi phản hồi lại cho người dùng.
  await AuthVerificationToken.create({ owner: id, token });

  //Gửi link mới
  await mail.sendVerification(req.user.email, link);

  res.json({ message: "Please check your email." });
};
