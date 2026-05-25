import express from "express";
import {
  googleAuth,
  logOut,
  register,
  activateUser,
  login,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.get("/logout", logOut);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/activate/:token", activateUser);

export default authRouter;