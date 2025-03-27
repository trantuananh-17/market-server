import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import UserModel from "src/models/user";
import "dotenv/config";

export const Signout: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await UserModel.findOne({
    _id: req.user.id,
    tokens: req.body.refreshToken,
  });

  if (!user)
    return sendErrorRes(res, "Unauthorized request, user not found!", 403);

  const newTokens = user.tokens.filter((token) => token !== refreshToken);
  user.tokens = newTokens;
  await user.save();

  res.send();
};
