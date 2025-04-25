import { RequestHandler } from "express";
import "dotenv/config";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import cloudUploader from "src/config/cloud";

export const updateAvatar: RequestHandler = async (req, res) => {
  const { avatar } = req.files;

  if (Array.isArray(avatar)) {
    return sendErrorRes(res, "Multiple files are not allowed!", 422);
  }

  if (!avatar.mimetype?.startsWith("image")) {
    return sendErrorRes(res, "Invalid image file!", 422);
  }

  const user = await UserModel.findById(req.user.id);

  if (!user) {
    return sendErrorRes(res, "User not found!", 404);
  }

  if (user.avatar?.id) {
    // xóa file avatar
    await cloudUploader.destroy(user.avatar.id);
  }

  // upload file avatar
  const { secure_url: url, public_id: id } = await cloudUploader.upload(
    avatar.filepath,
    {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    }
  );

  user.avatar = { url, id };
  await user.save();

  res.json({ ...req.user, avatar: user.avatar.url });
};
