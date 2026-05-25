import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    credits: {
      type: Number,
      default: 100,
    },
    // تحديد الرتبة ضروري ليعرف الكود كم سيشحن رصيد
    role: {
      type: String,
      default: "free",
      enum: ["free", "basic", "pro"],
    },
    // لتتبع وقت آخر عملية شحن تلقائية
    lastCreditReset: {
      type: Date,
      default: Date.now,
    },
    password: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;