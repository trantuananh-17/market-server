import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const GrantAccessToken: RequestHandler = async (req, res) => {
  /**
1. Đọc và xác thực refresh token.
2. Tìm người dùng với payload.id và refresh token.
3. Nếu refresh token hợp lệ nhưng không tìm thấy người dùng, token đã bị lộ.
4. Xóa tất cả các token cũ và gửi phản hồi lỗi.
5. Nếu token hợp lệ và người dùng được tìm thấy, tạo mới refresh token và access token.
6. Xóa token cũ, cập nhật người dùng và gửi token mới.
   */

  // Đọc và xác thực refresh token.
  const { refreshToken } = req.body;

  if (!refreshToken) return sendErrorRes(res, "Unauthorized request!", 403);

  //  Xác thực refresh token và lấy payload.
  const payload = jwt.verify(refreshToken, "secret") as { id: string };

  // Kiểm tra nếu payload không có id (token không hợp lệ hoặc bị lỗi).
  if (!payload.id) sendErrorRes(res, "Unauthorized request!", 401);

  // Tìm người dùng với payload.id và xác minh rằng refresh token đang được sử dụng.
  const user = await UserModel.findOne({
    _id: payload.id,
    tokens: refreshToken,
  });

  if (!user) {
    // người dùng bị xâm phạm, xóa tất cả các tokens trước đó
    await UserModel.findByIdAndUpdate(payload.id, { tokens: [] });
    return sendErrorRes(res, "Unauthorized request!", 401);
  }

  // Nếu refresh token hợp lệ và người dùng đã được xác thực, tạo mới access token và refresh token.
  const newAccessToken = jwt.sign({ id: user._id }, "secret", {
    expiresIn: "15m",
  });

  const newRefreshToken = jwt.sign({ id: user._id }, "secret");

  // Xóa refresh token cũ khỏi danh sách tokens của người dùng và thay thế bằng refresh token mới.
  const filteredTokens = user.tokens.filter((token) => token !== refreshToken);
  user.tokens = filteredTokens;
  user.tokens.push(newRefreshToken);
  await user.save();

  // Trả về token mới cho người dùng.
  res.json({
    tokens: { refresh: newRefreshToken, access: newAccessToken },
  });
};
