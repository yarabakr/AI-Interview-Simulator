import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
  question: String,
  difficulty: String,
  timeLimit: Number,
  answer: String,
  optimalAnswer: { type: String, default: "" },
  feedback: String,

  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
  // --- الحقل الجديد لتخزين تحليل المشاعر لكل سؤال ---
  emotionalAnalysis: { type: String, default: "Neutral" },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    language: {
      type: String,
      default: "en",
    },
    resumeText: {
      type: String,
    },
    questions: [questionsSchema],

    finalScore: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Incompleted", "completed"],
      default: "Incompleted",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;