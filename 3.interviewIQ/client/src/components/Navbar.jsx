import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { BsRobot, BsCoin } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import AuthModel from "../components/AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // حالة القائمة للموبايل

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Interview", path: "/interview" },
    { name: "History", path: "/history" },
    { name: "Pricing", path: "/Pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full bg-[#8935b0] sticky top-0 z-[100] shadow-md px-4 md:px-12 py-3">
      <div className="w-full flex justify-between items-center">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <BsRobot size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-white text-xl tracking-tight">
              AI<span className="text-purple-200"> Interview Simulator</span>
            </h1>
          </div>
        </div>

        {/* Desktop Links - تختفي في الشاشات الصغيرة */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="text-white/90 hover:text-white font-medium text-sm transition-all hover:scale-105"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Credits */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 md:px-4 py-2 rounded-full text-white font-bold text-xs md:text-sm transition-all"
            >
              <BsCoin size={18} className="text-[#FFB800]" />
              <span>{userData?.credits || 0}</span>
            </button>

            <AnimatePresence>
              {showCreditPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl p-5 z-50 border border-purple-50"
                >
                  <p className="text-sm text-gray-600 mb-4">
                    Need more credits?
                  </p>
                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setShowCreditPopup(false);
                    }}
                    className="w-full bg-[#8935b0] text-white py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-100"
                  >
                    {" "}
                    Buy more{" "}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            {userData ? (
              <button
                onClick={() => {
                  setShowUserPopup(!showUserPopup);
                  setShowCreditPopup(false);
                }}
                className="w-10 h-10 bg-white text-[#8935b0] rounded-full flex items-center justify-center font-bold shadow-md border-2 border-purple-200"
              >
                {userData.name.slice(0, 1).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-white text-[#8935b0] px-5 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                Join
              </button>
            )}

            <AnimatePresence>
              {showUserPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-2xl p-2 border border-purple-50 z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/history");
                      setShowUserPopup(false);
                    }}
                    className="w-full text-left text-sm px-4 py-2.5 hover:bg-purple-50 rounded-xl text-gray-700 font-medium"
                  >
                    {" "}
                    History{" "}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm px-4 py-2.5 flex items-center gap-2 text-red-500 hover:bg-red-50 rounded-xl font-medium"
                  >
                    {" "}
                    <HiOutlineLogout size={16} /> Logout{" "}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - يظهر عند الضغط على الـ Hamburger */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#722a94] overflow-hidden rounded-b-2xl shadow-inner"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white text-left py-3 px-4 hover:bg-white/10 rounded-xl transition-all"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </nav>
  );
}

export default Navbar;