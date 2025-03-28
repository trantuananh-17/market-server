import { Router } from "express";
import validate from "src/middleware/validator";
import {
  newUserSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from "src/utils/validationSchema";
import { Signup } from "src/controllers/auth/Signup";
import { VerifyEmail } from "src/controllers/auth/VerifyEmail";
import { SignIn } from "src/controllers/auth/Signin";
import { isAuth, isValidPassResetToken } from "src/middleware/isAuth";
import { SendProfile } from "src/controllers/auth/SendProfile";
import { GenerateVertificationLink } from "src/controllers/auth/GenerateVertificationLink";
import { GrantAccessToken } from "src/controllers/auth/GrantAccessToken";
import { Signout } from "src/controllers/auth/Signout";
import { GenerateForgetPassLink } from "src/controllers/auth/GenerateForgetPassLink";
import { GrantValid } from "src/controllers/auth/GrantValid";
import { UpdatePassword } from "src/controllers/auth/UpdatePassword";
import { UpdateProfile } from "src/controllers/auth/UpdateProfile";
import fileParser from "src/middleware/fileParser";
import { UpdateAvatar } from "src/controllers/auth/UpdateAvatar";
import { SendPublicProfile } from "src/controllers/auth/SendPublicProfile";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), Signup);
authRouter.post("/verify", validate(verifyTokenSchema), VerifyEmail);
authRouter.get("/verify-token", isAuth, GenerateVertificationLink);
authRouter.post("/sign-in", SignIn);
authRouter.get("/profile", isAuth, SendProfile);
authRouter.post("/refresh-token", GrantAccessToken);
authRouter.post("/sign-out", isAuth, Signout);
authRouter.post("/forget-pass", GenerateForgetPassLink);
authRouter.post(
  "/verify-pass-reset-token",
  validate(verifyTokenSchema),
  isValidPassResetToken,
  GrantValid
);
authRouter.post(
  "/reset-pass",
  validate(resetPasswordSchema),
  isValidPassResetToken,
  UpdatePassword
);
authRouter.patch("/update-profile", isAuth, UpdateProfile);
authRouter.patch("/update-avatar", isAuth, fileParser, UpdateAvatar);
authRouter.get("/profile/:id", isAuth, SendPublicProfile);

export default authRouter;
