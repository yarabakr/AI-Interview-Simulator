import React, { useState } from "react";
import { BsRobot, BsEnvelope, BsPerson, BsLock } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // مصلحة: دالة جوجل صارت بتعمل Redirect دغري بعد النجاح
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const gName = User.displayName;
      const gEmail = User.email;

      const result = await axios.post(
        `${ServerUrl}/api/auth/google`,
        { name: gName, email: gEmail },
        { withCredentials: true },
      );

      if (result.data) {
        dispatch(setUserData(result.data));
        // هاد السطر هو اللي كان ناقص عشان ينقلك دغري
        navigate("/");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      dispatch(setUserData(null));
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${ServerUrl}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert(res.data.message);
      setMode("login");
    } catch (error) {
      console.error("Register Error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${ServerUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      if (res.data) {
        dispatch(setUserData(res.data));
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const inputClasses =
    "w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-12 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8935b0]/20 focus:border-[#8935b0] transition-all shadow-sm";

  return (
    <div
      className={`w-full flex items-center justify-center relative ${isModel ? "" : "min-h-screen bg-[#FBFCFF] overflow-hidden"}`}
    >
      {/* خلفية فاتحة جداً ومريحة للعين */}
      {!isModel && (
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#8935b0]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px]" />
        </div>
      )}

      <div
        className={`relative z-10 w-full flex flex-col lg:flex-row items-center justify-center gap-16 ${isModel ? "p-0" : "max-w-6xl px-6"}`}
      >
        {!isModel && (
          <div className="hidden lg:flex flex-col w-1/2 text-[#1D2146] space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-[#8935b0] text-white rounded-2xl shadow-lg shadow-purple-200">
                <BsRobot size={28} />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                AI Interview Simulator
              </span>
            </motion.div>

            <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-[#1D2146]">
              Your AI <br />
              <span className="text-[#8935b0]">Career Coach.</span>
            </h1>

            <p className="text-gray-500 text-xl font-light leading-relaxed max-w-md">
              The smartest way to prepare for your next big opportunity. Simple,
              fast, and effective.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full ${isModel ? "max-w-md" : "max-w-[460px]"} bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]`}
        >
          <div className="text-center mb-10">
            <h3 className="text-[#1D2146] text-3xl font-bold mb-3 tracking-tight">
              {mode === "login" ? "Sign In" : "Register"}
            </h3>
            <p className="text-gray-400 font-medium">
              Continue your journey with us.
            </p>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.97] mb-8 shadow-sm"
          >
            <FcGoogle size={24} />
            Google Login
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-[1px] bg-gray-100"></div>
            </div>
            <span className="relative bg-white px-5 mx-auto block w-fit text-[11px] text-gray-300 uppercase tracking-[0.3em] font-bold">
              Or Email
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  <BsPerson
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <BsEnvelope
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={20}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="relative">
              <BsLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={20}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
              />
            </div>

            <button
              onClick={mode === "login" ? handleLogin : handleRegister}
              className="w-full bg-[#8935b0] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-100 hover:bg-[#762da0] transition-all active:scale-[0.97] mt-6"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-gray-400 font-medium hover:text-[#8935b0] transition-colors"
            >
              {mode === "login" ? "New here? " : "Joined us before? "}
              <span className="text-[#8935b0] font-bold border-b-2 border-[#8935b0]/20 pb-0.5 ml-1">
                {mode === "login" ? "Create account" : "Sign in"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;