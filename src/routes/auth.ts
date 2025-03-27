import { Router } from "express";
import validate from "src/middleware/validator";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { Signup } from "src/controllers/auth/Signup";
import { VerifyEmail } from "src/controllers/auth/VerifyEmail";
import { SignIn } from "src/controllers/auth/Signin";
import { isAuth } from "src/middleware/isAuth";
import { SendProfile } from "src/controllers/auth/SendProfile";
import { GenerateVertificationLink } from "src/controllers/auth/GenerateVertificationLink";
import { GrantAccessToken } from "src/controllers/auth/GeantAccessToken";
import { Signout } from "src/controllers/auth/Signout";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), Signup);
authRouter.post("/verify", validate(verifyTokenSchema), VerifyEmail);
authRouter.get("/verify-token", isAuth, GenerateVertificationLink);
authRouter.post("/sign-in", SignIn);
authRouter.get("/profile", isAuth, SendProfile);
authRouter.post("/refresh-token", GrantAccessToken);
authRouter.post("/sign-out", isAuth, Signout);

export default authRouter;
