import React, { useState } from "react";
import {
  BsRobot,
  BsGithub,
  BsLinkedin,
  BsTwitterX,
  BsSendFill,
} from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Done! Updates will be sent to: ${email}`);
      setEmail("");
    }
  };

  // وظيفة التنقل السلس داخل الهوم
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#0F112A] pt-20 pb-10 overflow-hidden text-white/70">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap');
          .font-title { font-family: 'Outfit', sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8935b0]/30 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#8935b0] rounded-full blur-[120px] opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* العمود الأول: الهوية */}
          <div className="space-y-6">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="bg-[#8935b0] text-white p-2.5 rounded-xl">
                <BsRobot size={22} />
              </div>
              <h2 className="font-title font-black text-2xl text-white">
                AI Interview <span className="text-[#8935b0]"> Simulator</span>
              </h2>
            </div>
            <p className="font-body text-sm italic font-light">
              Elevate your career with AI-driven simulations and real-time
              feedback.
            </p>
          </div>

          {/* العمود الثاني: الروابط الأساسية (صفحات) */}
          <div className="space-y-6">
            <h3 className="font-title text-white font-bold text-lg">
              Main Pages
            </h3>
            <ul className="font-body space-y-4 text-sm font-medium">
              <li>
                <button
                  onClick={() => navigate("/interview")}
                  className="hover:text-[#8935b0] transition-all underline-offset-4 hover:underline"
                >
                  Start Interview
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/history")}
                  className="hover:text-[#8935b0] transition-all underline-offset-4 hover:underline"
                >
                  View History
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/pricing")}
                  className="hover:text-[#8935b0] transition-all underline-offset-4 hover:underline"
                >
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: استكشاف الصفحة (Sections) */}
          <div className="space-y-6">
            <h3 className="font-title text-white font-bold text-lg">Explore</h3>
            <ul className="font-body space-y-4 text-sm font-medium">
              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="hover:text-[#8935b0] transition-all"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("ai-features")}
                  className="hover:text-[#8935b0] transition-all"
                >
                  AI Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("interview-modes")}
                  className="hover:text-[#8935b0] transition-all"
                >
                  Interview Modes
                </button>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: Newsletter & Social */}
          <div className="space-y-6">
            <h3 className="font-title text-white font-bold text-lg">
              Stay Updated
            </h3>
            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="font-body w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0]/50 text-white"
              />
              <button
                type="submit"
                className="absolute right-1 bg-[#8935b0] p-2.5 rounded-lg text-white"
              >
                <BsSendFill size={14} />
              </button>
            </form>
            <div className="flex gap-5 pt-2 text-xl">
              <BsGithub className="hover:text-[#8935b0] cursor-pointer transition-colors" />
              <BsLinkedin className="hover:text-[#8935b0] cursor-pointer transition-colors" />
              <BsTwitterX className="hover:text-[#8935b0] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* خط الحقوق */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-40 font-body">
          <span>
            © {currentYear} AI Interview Simulator. Designed for success.
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#3DFF3D] rounded-full animate-pulse" />
            <span>AI Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;