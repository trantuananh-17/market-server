import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import crypto from "crypto";
import UserModel from "src/models/user";
import AuthVerificationToken from "src/models/authVerificationToken";
import "dotenv/config";
import mail from "src/utils/mail";

export const signup: RequestHandler = async (req, res) => {
  // Đọc dữ liệu đầu vào: tên, email, mật khẩu.
  const { email, password, name } = req.body;

  // // Kiểm tra xem có tài khoản tồn tại chưa.
  const existingUser = await UserModel.findOne({ email });

  // // Gửi lỗi nếu có, nếu không thì tạo tài khoản mới và lưu người dùng vào cơ sở dữ liệu.
  if (existingUser)
    return sendErrorRes(
      res,
      "Unauthorized request, email is already in use!",
      401
    );

  const user = await UserModel.create({ name, email, password });

  // // Tạo và lưu token.
  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerificationToken.create({ owner: user._id, token });

  // // Gửi liên kết xác minh với mã xác minh đến email đăng ký.
  const link = `${process.env.API_URL}/verify.html?id=${user._id}&token=${token}`;

  // const transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: `${process.env.MAILTRAP_USER}`,
  //     pass: `${process.env.MAILTRAP_PASSWORD}`,
  //   },
  // });

  // await transport.sendMail({
  //   from: "verification@myapp.com",
  //   to: user.email,
  //   html: `<h1>Please click on <a href="${link}">this link</a> to verify your account</h1>`,
  // });
  await mail.sendVerification(user.email, link);

  res.json({ message: "Please check your inbox." });
};
