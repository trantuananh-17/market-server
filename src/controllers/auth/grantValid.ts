import { RequestHandler } from "express";
import crypto from "crypto";
import AuthVerificationToken from "src/models/authVerificationToken";
import "dotenv/config";
import mail from "src/utils/mail";

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};
