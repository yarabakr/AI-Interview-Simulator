import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../config/email.js";

// --- Google Auth ---
const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        isActive: true, // مستخدم جوجل يعتبر مفعل تلقائياً
      });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, // تم تصحيحها من http إلى httpOnly
      secure: false, // اجعليها true عند الرفع على استضافة (Production)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Google auth error ${error.message}` });
  }
};

// --- Log Out ---
const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "LogOut successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error.message}` });
  }
};

// --- Register ---
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      isActive: false, // يبقى غير مفعل حتى يضغط على الرابط
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const link = `http://localhost:5173/activate/${token}`;

    // تغليف إرسال الإيميل بـ try/catch لضمان عدم انهيار التسجيل إذا فشل السيرفر
    try {
      await sendEmail(email, link);
    } catch (emailError) {
      console.error("Email Service Error:", emailError.message);
      // نخبر المستخدم أن الحساب نُشئ ولكن هناك مشكلة في الإيميل
      return res.status(201).json({
        message:
          "Account created, but failed to send activation email. Please contact support.",
      });
    }

    res.status(201).json({ message: "Registered successfully, check email" });
  } catch (error) {
    res.status(500).json({ message: `register error ${error.message}` });
  }
};

// --- Activate User ---
const activateUser = async (req, res) => {
  try {
    const { token } = req.params;

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByIdAndUpdate(decoded.userId, {
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // بدلاً من مجرد نص، نرسل رد يوضح النجاح
    res.send(`
      <div style="text-align:center; padding:50px; font-family:Arial;">
        <h1 style="color:green;">Account Activated!</h1>
        <p>You can now close this tab and log in.</p>
        <a href="http://localhost:5173/login">Go to Login</a>
      </div>
    `);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Activation failed: Link expired or invalid" });
  }
};

// --- Login ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // التحقق مما إذا كان الحساب مفعلاً
    if (!user.isActive) {
      return res.status(400).json({
        message: "Please activate your account from your email first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // اجعليها true في الـ production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // نرسل بيانات المستخدم (بدون الباسورد للأمان)
    const { password: _, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: `login error ${error.message}` });
  }
};

export { googleAuth, logOut, register, activateUser, login };