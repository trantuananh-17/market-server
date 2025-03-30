import { RequestHandler } from "express";
import "dotenv/config";

export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: req.user,
  });
};
