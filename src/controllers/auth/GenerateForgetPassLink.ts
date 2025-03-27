import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import crypto from "crypto";
import "dotenv/config";
import PasswordResetToken from "src/models/passwordResetToken";
import mail from "src/utils/mail";

export const GenerateForgetPassLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return sendErrorRes(res, "Account not found", 404);

  // Remove token
  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  // Create new token
  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({ owner: user._id, token });

  // send the link to user's email
  const passResetLink = `${process.env.API_URL}/reset-password.html?id=${user._id}&token=${token}`;

  await mail.sendPasswordResetLink(user.email, passResetLink);

  // send response back
  res.json({ message: "Please check your email" });
};
