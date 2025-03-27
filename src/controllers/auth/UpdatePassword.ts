import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import mail from "src/utils/mail";
import PasswordResetToken from "src/models/passwordResetToken";

export const UpdatePassword: RequestHandler = async (req, res) => {
  const { id, password } = req.body;
  const user = await UserModel.findById(id);

  if (!user) return sendErrorRes(res, "Unauthorized access!", 403);

  const matched = await user.comparePassword(password);

  if (matched)
    return sendErrorRes(res, "The new password must be different!", 422);

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  await mail.sendPasswordUpdateMessage(user.email);

  res.json({ message: "Password resets successfully." });
};
