import { sendErrorRes } from "./../utils/helper";
import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "src/models/user";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    // Đọc header xác thực (authorization header)
    const authToken = req.headers.authorization;

    // Kiểm tra xem ta có token không.
    if (!authToken) return sendErrorRes(res, "unauthorized request", 403);

    // Dạng token: Bearer eyJabcd.....
    const token = authToken.split("Bearer ")[1];

    // Lấy id người dùng từ token (sẽ có nó dưới dạng payload).
    const payload = jwt.verify(token, "secret") as { id: string };

    // Kiểm tra xem có người dùng với id này không.
    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrorRes(res, "unauthorized request", 403);

    // Gắn thông tin người dùng vào đối tượng req.
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    };

    next();
  } catch (error) {
    // Xử lý lỗi cho các token đã hết hạn.
    if (error instanceof TokenExpiredError) {
      return sendErrorRes(res, "Session expired", 401);
    }

    if (error instanceof JsonWebTokenError) {
      return sendErrorRes(res, "Unauthorized access", 401);
    }

    next(error);
  }
};
