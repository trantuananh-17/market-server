import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const signIn: RequestHandler = async (req, res) => {
  // Đọc dữ liệu: email và mật khẩu
  const { email, password } = req.body;

  // Tìm người dùng với email đã cung cấp.
  const user = await UserModel.findOne({ email });
  if (!user) return sendErrorRes(res, "Email/Password mismatch!", 403);

  // Kiểm tra xem mật khẩu có hợp lệ không.
  const isMatched = await user.comparePassword(password);

  // Nếu mật khẩu không hợp lệ, gửi lỗi; nếu hợp lệ, tạo mã truy cập và mã làm mới.
  if (!isMatched) return sendErrorRes(res, "Email/Password mismatch!", 403);

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, `${process.env.JWT_SECRET}`);

  // Lưu mã làm mới vào cơ sở dữ liệu.
  if (!user.tokens) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);

  await user.save();

  // Gửi cả hai mã cho người dùng.
  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
      avatar: user.avatar?.url,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};
