import React from "react";
import { motion } from "framer-motion"; // تعديل بسيط في اسم المكتبة لضمان العمل
import { useState } from "react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaLanguage,
} from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData, updateUserStatus } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [language, setLanguage] = useState("en");

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState("[]");
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formData,
        { withCredentials: true },
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log("ERROR:", error.response || error.message || error);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          resumeText,
          projects,
          skills,
          numQuestions,
          language,
        },
        { withCredentials: true },
      );
      const updatedCredits = result.data.creditsLeft;
      if (updatedCredits !== undefined) {
        dispatch(
          updateUserStatus({
            credits: updatedCredits,
            role: userData?.role, // الحفاظ على الـ role الحالي للمستخدم (سواء كان Pro أو عادي)
          }),
        );
      }

      setLoading(false);
      // التعديل هنا: نمرر النتيجة ونضيف إليها اللغة يدوياً للتأكيد
      onStart({ ...result.data, language: language });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          // تم تغيير الخلفية من green إلى purple
          className="relative bg-gradient-to-br from-purple-50 to-purple-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your Interview
          </h2>

          <p className="text-gray-600 mb-10">
            Get ready to showcase your skills and experience in a simulated
            interview environment.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-[#8935b0] text-xl" />, // تغيير اللون للموف
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-[#8935b0] text-xl" />, // تغيير اللون للموف
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-[#8935b0] text-xl" />, // تغيير اللون للموف
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8935b0] outline-none transition" // تغيير الـ focus للموف
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8935b0] outline-none transition" // تغيير الـ focus للموف
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8935b0] outline-none transition" // تغيير الـ focus للموف
            >
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* [NEW ADDITION]: Language Selection Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaLanguage className="text-[#8935b0]" /> Select Interview
                Language
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-2 rounded-xl border transition-all duration-300 ${
                    language === "en"
                      ? "bg-[#8935b0] text-white border-[#8935b0] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ar")}
                  className={`flex-1 py-2 rounded-xl border transition-all duration-300 ${
                    language === "ar"
                      ? "bg-[#8935b0] text-white border-[#8935b0] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            <div>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl 
    focus:ring-2 focus:ring-[#8935b0] outline-none transition"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={8}>8 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            {/* UPLOAD SECTION */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#8935b0] hover:bg-purple-50 transition" // تغيير الـ hover للموف
              >
                <FaFileUpload className="text-4xl mx-auto text-[#8935b0] mb-3" />{" "}
                {/* تغيير اللون للموف */}
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-gray-600 font-medium">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (Optional)"}
                </p>
                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* RESULT SECTION */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 mt-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Resume Analysis Result
                </h3>

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Projects:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm" // تغيير ألوان الـ Tag للموف
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full disabled:bg-gray-600 bg-[#8935b0] hover:bg-[#7a2e9d] text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md" // تغيير لون الزر الأساسي للموف
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;