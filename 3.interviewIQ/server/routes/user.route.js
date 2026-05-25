import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getCurrentUser,
  upgradeUserRole,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);

// --- السطر الجديد لتمكين عملية الترقية الفورية ---
userRouter.post("/upgrade", upgradeUserRole);

export default userRouter;