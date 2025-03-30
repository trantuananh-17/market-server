import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";

export const updateProfile: RequestHandler = async (req, res) => {
  const { name } = req.body;
  if (typeof name !== "string" || name.trim().length < 3) {
    return sendErrorRes(res, "Invalid name!", 422);
  }

  await UserModel.findByIdAndUpdate(req.user.id, { name });

  res.json({ profile: { ...req.user, name } });
};
