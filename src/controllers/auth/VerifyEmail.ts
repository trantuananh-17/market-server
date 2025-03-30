import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import AuthVerificationToken from "src/models/authVerificationToken";
import "dotenv/config";

export const verifyEmail: RequestHandler = async (req, res) => {
  // Đọc dữ liệu: id và token
  const { id, token } = req.body;

  // Tìm token trong cơ sở dữ liệu (sử dụng id của người sở hữu)
  const authToken = await AuthVerificationToken.findOne({ owner: id });

  //Gửi lỗi nếu không tìm thấy token.
  if (!authToken) return sendErrorRes(res, "unauthorized request!", 403);
  // Kiểm tra token có hợp lệ hay không (vì chúng ta có giá trị đã mã hóa).
  const isMatched = authToken.compareToken(token);

  // Nếu không hợp lệ, gửi lỗi; nếu hợp lệ, cập nhật trạng thái người dùng là đã xác minh.
  if (!isMatched)
    return sendErrorRes(res, "unauthorized request, invalid token!", 403);

  await UserModel.findByIdAndUpdate(id, { verified: true });

  // Xóa token khỏi cơ sở dữ liệu.
  await AuthVerificationToken.findByIdAndDelete(authToken._id);

  // Gửi thông báo thành công.
  res.json({ message: "Thanks for joining us, your email is verified" });
};
