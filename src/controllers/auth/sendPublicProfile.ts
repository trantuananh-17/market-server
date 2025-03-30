import { RequestHandler } from "express";
import "dotenv/config";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import { isValidObjectId } from "mongoose";

export const sendPublicProfile: RequestHandler = async (req, res) => {
  const profileId = req.params.id;

  if (!isValidObjectId(profileId)) {
    return sendErrorRes(res, "Invalid profile id!", 422);
  }

  const user = await UserModel.findById(profileId);

  if (!user) {
    return sendErrorRes(res, "Profile not found!", 404);
  }

  res.json({
    profile: { id: user._id, name: user.name, avatar: user.avatar?.url },
  });
};
