import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import cors from "cors";
import { Server } from "socket.io";
import cron from "node-cron";
import userModel from "./models/user.model.js";

dotenv.config();
// ضع ملف الـ json الذي ستحمله من جوجل في مجلد السيرفر الأساسي
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./service-account-key.json";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);

const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });
});

// --- نظام الشحن التلقائي (كل 12 ساعة) ---
// التعبير "0 */12 * * *" يعني عند الدقيقة 0 كل 12 ساعة
cron.schedule("0 */12 * * *", async () => {
  try {
    console.log("Starting 12-hour credits background recharge...");

    const NOW = new Date();

    // تحديث كافة المستخدمين بناءً على أدوارهم وتحديث تاريخ Reset
    await userModel.updateMany(
      { role: "free" },
      { credits: 100, lastCreditReset: NOW },
    );
    await userModel.updateMany(
      { role: "basic" },
      { credits: 300, lastCreditReset: NOW },
    );
    await userModel.updateMany(
      { role: "pro" },
      { credits: 650, lastCreditReset: NOW },
    );

    console.log("All credits have been reset successfully by Cron Job.");
  } catch (error) {
    console.error("Error during 12-hour cron credit reset:", error);
  }
});

export default app;