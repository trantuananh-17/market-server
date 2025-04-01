import { sendErrorRes } from "./../utils/helper";
import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import PasswordResetToken from "src/models/passwordResetToken";
import UserModel from "src/models/user";
import "dotenv/config";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
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
    const payload = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      id: string;
    };

    // Kiểm tra xem có người dùng với id này không.
    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrorRes(res, "unauthorized request", 403);

    // Gắn thông tin người dùng vào đối tượng req.
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
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

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { id, token } = req.body;
  const resetPassToken = await PasswordResetToken.findOne({ owner: id });

  if (!resetPassToken)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);

  const matched = await resetPassToken.compareToken(token);

  if (!matched)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);

  next();
};
