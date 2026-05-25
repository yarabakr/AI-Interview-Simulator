import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsCheckCircleFill,
  BsStarFill, 
  BsStar 
} from "react-icons/bs";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel";
import Footer from "../components/Footer.jsx";
import dashboardMockupImg from "../assets/dashboard.png";
import candidateProfileImg from "../assets/candidateProfileImg.png";
import voiceUiMockupImg from "../assets/voiceUiMockupImg.png";

// الصور
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const { reviews } = useSelector((state) => state.reviews || { reviews: [] });

  // درجة الموف البارد للفصل بين السكاشن
  const lavenderBG = "bg-[#F9F5FF]";

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&family=Outfit:wght@300;400;600;800&display=swap');
          .font-title { font-family: 'Outfit', sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <Navbar />

      {/* ========================== 1. HERO ========================== */}
      <section className="relative w-full px-6 md:px-16 pt-20 pb-12 md:pt-32 md:pb-24 flex flex-col md:flex-row items-center justify-between max-w-8xl mx-auto overflow-hidden bg-white">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 text-[#3DFF3D] opacity-40 hidden md:block"
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path
              d="M10 20 Q 15 10, 20 20 T 30 20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-40 left-20 w-4 h-4 bg-[#FFB800] rounded-full opacity-40 hidden md:block"
        />

        <div className="w-full md:w-1/2 z-10 text-left mb-16 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-body inline-flex items-center bg-[#F3EBFF] text-[#8935b0] px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide uppercase"
          >
            ✨ Today Special Offer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-title text-4xl md:text-5xl font-black text-[#1D2146] leading-[1.1] mb-6"
          >
            Best <span className="text-[#8935b0]">AI-Powered</span> <br />{" "}
            Interview Preparation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body text-[#6C757D] text-lg md:text-ms max-w-lg mb-10 leading-relaxed font-medium"
          >
            Practice role-specific mock interviews with real-time AI feedback.
            The smartest way to land your dream job.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                userData ? navigate("/interview") : setShowAuth(true)
              }
              className="font-body bg-[#8935b0] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-100 flex items-center gap-3 transition-all min-w-[200px] justify-center"
            >
              Start Interview <BsArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/history")}
              className="font-body bg-white text-[#1D2146] border-2 border-[#E9ECEF] px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all min-w-[200px] justify-center"
            >
              View History <BsBarChart size={20} />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0, rotateX: 12, rotateY: -15 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 mt-16 md:mt-0 relative"
          style={{ perspective: "1200px" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#F8F9FF] rounded-full -z-10" />
          <div className="relative bg-[#1D2146] p-2 rounded-[2.5rem] shadow-[-20px_30px_60px_rgba(0,0,0,0.2)] border-4 border-[#313766] overflow-hidden">
            <div className="flex gap-1.5 pb-2.5 px-5 pt-3 border-b border-white/5 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="p-4 grid grid-cols-2 gap-3.5">
              <div className="h-24 bg-white/5 rounded-xl border border-white/10 p-3.5 space-y-2">
                <div className="w-1/2 h-2 bg-purple-400/40 rounded-full" />
                <div className="w-full h-1.5 bg-white/10 rounded-full" />
              </div>
              <div className="h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                <BsBarChart className="text-[#8935b0] opacity-40" size={30} />
              </div>
              <div className="col-span-2 h-32 bg-[#111430] rounded-2xl border border-[#8935b0]/20 p-4 relative">
                <div className="font-body flex items-center gap-3 mb-4 text-white/70 font-bold text-xs uppercase tracking-widest">
                  <BsMic /> Recording...
                </div>
                <div className="flex items-end gap-1 h-10">
                  {[3, 7, 5, 9, 4, 8, 6, 3].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [h * 2, h * 4, h * 2] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1.5 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-purple-50 flex items-center gap-3"
            >
              <div className="bg-[#3DFF3D]/10 p-2 rounded-lg text-[#3DFF3D]">
                <BsCheckCircleFill size={18} />
              </div>
              <div className="font-body text-xs font-bold text-[#1D2146]">
                Score: 92%
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-purple-50 flex items-center gap-3"
            >
              <div className="bg-[#8935b0] p-2 rounded-lg text-white">
                <BsRobot size={20} />
              </div>
              <div className="font-body text-xs font-bold text-[#1D2146]">
                AI Ready
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========================== 2. HOW IT WORKS (تم إضافة id) ========================== */}
      <div
        id="how-it-works"
        className="relative mb-32 overflow-hidden px-6 md:px-16 max-w-8xl mx-auto bg-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8935b0_0%,transparent_40%)] opacity-10"></div>
        <div className="text-center mb-10 mt-20">
          <div className="font-body inline-block bg-[#E9D8FD] text-[#8935b0] text-xs px-4 py-1 rounded-full mb-4 font-medium">
            HOW IT WORKS
          </div>
          <h3 className="font-title text-[#1D2146] text-4xl md:text-5xl font-bold mb-6 leading-tight italic">
            Master Your Interview in{" "}
            <span className="bg-gradient-to-r from-[#8935b0] to-[#6F42C1] bg-clip-text text-transparent italic">
              3 Simple Steps
            </span>
          </h3>
          <p className="font-body text-[#6C757D] text-lg max-w-2xl mx-auto">
            Choose your role, practice with AI, and refine your performance with
            real-time insights.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-5">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="col-span-2 h-72 rounded-3xl overflow-hidden relative group p-1 bg-[#F8F9FF] border border-[#ADB5BD]/20 shadow-inner"
            >
              <span className="font-body absolute top-4 left-4 bg-[#8935b0] text-white text-xs px-3 py-1 rounded-full animate-pulse z-10">
                Live AI Analysis
              </span>
              <img
                src={dashboardMockupImg}
                alt="AI Dashboard"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="h-44 rounded-3xl overflow-hidden border border-[#3DFF3D]/20 bg-[#3DFF3D]/10 p-1 relative group"
            >
              <img
                src={voiceUiMockupImg}
                alt="Voice UI"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="h-44 rounded-3xl overflow-hidden border border-[#FFB800]/20 bg-[#FFB800]/10 p-1 relative group"
            >
              <img
                src={candidateProfileImg}
                alt="Profile"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            {[
              {
                icon: <BsRobot size={26} />,
                title: "Role & Experience Selection",
                desc: "Define your target position. AI builds a custom environment that mirrors real-world interviews.",
              },
              {
                icon: <BsMic size={26} />,
                title: "Smart Voice Interview",
                desc: "Practice naturally. The AI analyzes your speech and generates smart follow-ups.",
              },
              {
                icon: <BsClock size={26} />,
                title: "Timer-Based Simulation",
                desc: "Train under pressure and improve speed, clarity, and confidence.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.03, y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group flex items-start gap-6 p-6 rounded-[2rem] bg-white/70 backdrop-blur-lg border border-transparent hover:border-[#8935b0]/40 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="font-title absolute top-4 right-6 text-[#8935b0]/20 text-5xl font-bold">{`0${index + 1}`}</div>
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#F8F9FF] border-2 border-[#8935b0] text-[#8935b0] flex items-center justify-center shadow-sm group-hover:bg-[#8935b0] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-title text-[#1D2146] font-bold text-xl mb-2 group-hover:text-[#8935b0] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-[#6C757D] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================== 3. CAPABILITIES (تم إضافة id) ========================== */}
      <div
        id="ai-features"
        className={`py-24 relative overflow-hidden ${lavenderBG}`}
      >
        <div className="text-center mb-16">
          <div className="font-body inline-block bg-[#E9D8FD] text-[#8935b0] text-xs px-4 py-1 rounded-full mb-4 font-medium">
            OUR FEATURES
          </div>
          <h2 className="font-title text-4xl md:text-5xl font-semibold text-[#1D2146] mb-4 tracking-tight italic">
            Explore Our AI Capabilities
          </h2>
          <p className="font-body text-[#6C757D] max-w-2xl mx-auto text-lg">
            Powerful tools designed to elevate your interview performance.
          </p>
        </div>
        <div className="w-full overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...Array(2)]
              .flatMap(() => [
                {
                  image: evalImg,
                  icon: <BsBarChart />,
                  title: "AI Answer Evaluation",
                  desc: "Analyze communication, technical accuracy, and confidence instantly.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText />,
                  title: "Resume-Based Interviews",
                  desc: "Get personalized interview questions based on your CV.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText />,
                  title: "Download PDF Reports",
                  desc: "Receive detailed feedback reports with improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart />,
                  title: "Performance Tracking",
                  desc: "Monitor your progress with smart analytics and history tracking.",
                },
              ])
              .map((item, index) => (
                <div
                  key={index}
                  className="w-[350px] flex-shrink-0 bg-white rounded-3xl overflow-hidden border border-[#ADB5BD]/20 shadow-sm hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="h-80 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F8F9FF] text-[#8935b0]">
                        {item.icon}
                      </div>
                      <h3 className="font-title text-1xl text-[#1D2146] font-bold group-hover:text-[#8935b0] transition">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-body text-[#6C757D] text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      </div>

      {/* ========================== 4. INTERVIEW MODES (تم إضافة id) ========================== */}
      <div id="interview-modes" className="mb-0 bg-white px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <span className="font-body inline-block bg-[#E9D8FD] text-[#8935b0] text-xs px-4 py-1 rounded-full mb-2 font-medium tracking-wide">
            INTERVIEW MODES
          </span>
          <h2 className="font-title text-4xl md:text-5xl font-bold text-[#1D2146] mt-0 leading-tight italic">
            Experience Different{" "}
            <span className="bg-gradient-to-r from-[#8935b0] to-[#6F42C1] bg-clip-text text-transparent italic">
              Interview Styles
            </span>
          </h2>
          <p className="font-body text-[#6C757D] max-w-xl mx-auto text-lg mt-4">
            Explore multiple AI-powered interview environments.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-8xl mx-auto">
          {[
            {
              img: hrImg,
              title: "HR Interview Mode",
              desc: "Behavioral and communication-based evaluation.",
            },
            {
              img: techImg,
              title: "Technical Mode",
              desc: "Advanced technical questions tailored to your role.",
            },
            {
              img: confidenceImg,
              title: "Confidence Detection",
              desc: "Analyze tone, confidence, and delivery style.",
            },
            {
              img: creditImg,
              title: "Credits System",
              desc: "Unlock premium interview experiences seamlessly.",
            },
          ].map((mode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white border border-[#ADB5BD]/20 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between gap-8 overflow-hidden"
            >
              <div className="z-10 w-1/2">
                <h3 className="font-title font-bold text-xl text-[#1D2146] mb-3 group-hover:text-[#8935b0] transition">
                  {mode.title}
                </h3>
                <p className="font-body text-[#6C757D] text-sm leading-relaxed">
                  {mode.desc}
                </p>
              </div>
              <div className="w-1/2 flex justify-end z-10">
                <img
                  src={mode.img}
                  alt={mode.title}
                  className="max-h-40 object-contain group-hover:scale-110 transition duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}


{/* ========================== 5. SUCCESS STORIES ========================== */}
<div className="py-24 px-6 md:px-16 bg-[#F8F9FF]">
        <div className="text-center mb-16">
          <span className="font-body inline-block bg-[#E9D8FD] text-[#8935b0] text-xs px-4 py-1 rounded-full mb-4 font-medium">
            Success Stories
          </span>

          <h2 className="font-title text-4xl md:text-5xl font-bold text-[#1D2146] mt-0 leading-tight italic">
            AI Interviews helped <span className="text-[#8935b0]">500+</span> candidates
          </h2>

          <p className="font-body text-[#6C757D] mt-4 text-lg">
            You're a mock interview away from your dream job.
          </p>
        </div>

        {/* شبكة عرض التقييمات الديناميكية */}
       <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
  {reviews && reviews.slice(0, 3).map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      className="bg-white p-8 rounded-3xl border border-[#E9ECEF] shadow-sm hover:shadow-xl transition-all text-center flex flex-col justify-between"
    >
      <div>
        {/* الحرف الأول من اسم المستخدم كـ Avatar عشوائي */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E9D8FD] flex items-center justify-center text-[#8935b0] font-bold text-lg">
          {item.name ? item.name.charAt(0).toUpperCase() : "A"}
        </div>

        {/* اسم المستخدم */}
        <h4 className="font-title text-[#1D2146] font-semibold">
          {item.name}
        </h4>

        {/* دور المستخدم الوظيفي المستهدف */}
        <p className="font-body text-sm text-[#6C757D] mb-4">
          {item.role}
        </p>

        {/* نص التقييم والمقالة المختصرة */}
        <p className="font-body text-[#495057] italic text-sm leading-relaxed mb-6">
          "{item.text}"
        </p>
      </div>

      {/* طباعة النجوم ديناميكياً بناءً على اختيار المستخدم (إذا لم يتوفر، يظهر 5 افتراضياً) */}
      <div className="flex justify-center gap-1 mt-auto pt-4 text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const currentRating = item.rating !== undefined ? item.rating : 5;
          return starIndex <= currentRating ? (
            <BsStarFill key={starIndex} size={18} />
          ) : (
            <BsStar key={starIndex} size={18} className="text-gray-200" />
          );
        })}
      </div>
    </motion.div>
  ))}
</div>
      </div>

      
      <Footer />
    </div>
  );
}

export default Home;