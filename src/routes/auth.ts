import { Router } from "express";
import { generateForgetPassLink } from "src/controllers/auth/generateforgetPassLink";
import { generateVertificationLink } from "src/controllers/auth/generateVerificationLink";
import { grantAccessToken } from "src/controllers/auth/grantAccessToken";
import { grantValid } from "src/controllers/auth/grantValid";
import { sendProfile } from "src/controllers/auth/sendProfile";
import { sendPublicProfile } from "src/controllers/auth/sendPublicProfile";
import { signIn } from "src/controllers/auth/signin";
import { signout } from "src/controllers/auth/signout";
import { signup } from "src/controllers/auth/signup";
import { updateAvatar } from "src/controllers/auth/updateAvatar";
import { updatePassword } from "src/controllers/auth/updatePassword";
import { updateProfile } from "src/controllers/auth/updateProfile";
import { verifyEmail } from "src/controllers/auth/verifyEmail";
import fileParser from "src/middleware/fileParser";
import { isAuth, isValidPassResetToken } from "src/middleware/isAuth";
import validate from "src/middleware/validator";
import {
  newUserSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from "src/utils/validationSchema";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), signup);
authRouter.post("/verify", validate(verifyTokenSchema), verifyEmail);
authRouter.get("/verify-token", isAuth, generateVertificationLink);
authRouter.post("/sign-in", signIn);
authRouter.get("/profile", isAuth, sendProfile);
authRouter.post("/refresh-token", grantAccessToken);
authRouter.post("/sign-out", isAuth, signout);
authRouter.post("/forget-pass", generateForgetPassLink);
authRouter.post(
  "/verify-pass-reset-token",
  validate(verifyTokenSchema),
  isValidPassResetToken,
  grantValid
);
authRouter.post(
  "/reset-pass",
  validate(resetPasswordSchema),
  isValidPassResetToken,
  updatePassword
);
authRouter.patch("/update-profile", isAuth, updateProfile);
authRouter.patch("/update-avatar", isAuth, fileParser, updateAvatar);
authRouter.get("/profile/:id", isAuth, sendPublicProfile);

export default authRouter;
