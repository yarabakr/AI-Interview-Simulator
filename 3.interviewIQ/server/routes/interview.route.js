import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { generateSpeech } from "../controllers/interview.controller.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  submitAnswer,
  getMyInterviews,
  getInterviewReport,
  softDeleteInterview,
  getWorkspaceInterviews,
  getImprovementData,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestion);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish", isAuth, finishInterview);
interviewRouter.get("/get-interview", isAuth, getMyInterviews);
interviewRouter.get("/report/:id", isAuth, getInterviewReport);
// --- المسارات الجديدة للتعديلات المطلوبة ---
interviewRouter.get("/workspace", isAuth, getWorkspaceInterviews);

interviewRouter.get("/improvement/:resumeId", isAuth, getImprovementData);

// أضيفي هذا السطر في ملف interviewRouter.js
interviewRouter.get("/get-interview-by-id/:id", isAuth, getInterviewReport);

interviewRouter.patch("/soft-delete/:id", isAuth, softDeleteInterview);

interviewRouter.delete("/:id", isAuth, softDeleteInterview);

// [MODIFIED]: يفضل أن تكون المسارات المحددة قبل المسارات التي تأخذ ID عام في الـ GET

interviewRouter.post("/generate-speech", isAuth, generateSpeech);
export default interviewRouter;