import { RequestHandler } from "express";
import "dotenv/config";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import { v2 as cloudinary } from "cloudinary";
const CLOUD_NAME = process.env.CLOUD_NAME!;
const CLOUD_KEY = process.env.CLOUD_KEY!;
const CLOUD_SECRET = process.env.CLOUD_SECRET!;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET,
  secure: true,
});

export const UpdateAvatar: RequestHandler = async (req, res) => {
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
    await cloudinary.uploader.destroy(user.avatar.id);
  }

  // upload file avatar
  const { secure_url: url, public_id: id } = await cloudinary.uploader.upload(
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
