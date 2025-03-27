import { RequestHandler } from "express";
import "dotenv/config";

export const SendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: req.user,
  });
};
