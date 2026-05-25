import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
function Step3Report({ report }) {
  const [openOptimal, setOpenOptimal] = useState({});

  const toggleOptimal = (index) => {
    setOpenOptimal((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const navigate = useNavigate();

  // [LOGIC IMPROVEMENT] - فحص ذكي جداً للغة لضمان عملها في كل الحالات
  const isArabic =
    report?.language === "ar" ||
    (report?.questionWiseScore?.[0]?.question &&
      /[\u0600-\u06FF]/.test(report.questionWiseScore[0].question));

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          {isArabic ? "جاري تحميل التقرير..." : "Loading Report..."}
        </p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  // [DICTIONARY] - القاموس الكامل لضمان عدم ضياع أي نص
  const UI = {
    title: isArabic ? "لوحة تحليل المقابلة" : "Interview Analytics Dashboard",
    subTitle: isArabic
      ? "رؤى الأداء المدعومة بالذكاء الاصطناعي"
      : "AI-powered performance insights",
    download: isArabic ? "تحميل التقرير PDF" : "Download PDF",
    overall: isArabic ? "الأداء العام" : "Overall Performance",
    skillTitle: isArabic ? "تقييم المهارات" : "Skill Evaluation",
    emotionsTitle: isArabic ? "تتبع الحالة الانفعالية" : "Emotional Tracking",
    trendTitle: isArabic ? "منحنى الأداء" : "Performance Trend",
    detailTitle: isArabic
      ? "تحليل الأسئلة المفصل"
      : "Detailed Question Analysis",
    feedback: isArabic ? "تقييم الذكاء الاصطناعي" : "AI Feedback",
    behavioral: isArabic ? "نصيحة سلوكية" : "Behavioral Tip",
    optimalTitle: isArabic
      ? "الإجابة المثالية من الذكاء الاصطناعي"
      : "Optimal AI Answer",
    optimalLoading: isArabic
      ? "جاري توليد أفضل إجابة لهذا السؤال..."
      : "AI is generating the best response for this question...",
    skillsList: {
      conf: isArabic ? "الثقة" : "Confidence",
      comm: isArabic ? "التواصل" : "Communication",
      corr: isArabic ? "الدقة" : "Correctness",
    },
  };

  const calculateEmotions = () => {
    const counts = { happy: 0, neutral: 0, surprised: 0, sad: 0, fearful: 0 };
    if (questionWiseScore.length === 0) return counts;
    questionWiseScore.forEach((q) => {
      const emotion = q.emotionalAnalysis?.toLowerCase().trim();
      if (counts.hasOwnProperty(emotion)) counts[emotion]++;
      else if (emotion === "positive") counts.happy++;
    });
    const percentages = {};
    Object.keys(counts).forEach((key) => {
      percentages[key] = Math.round(
        (counts[key] / questionWiseScore.length) * 100,
      );
    });
    return percentages;
  };

  const processedEmotions = calculateEmotions();
  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: UI.skillsList.conf, value: confidence },
    { label: UI.skillsList.comm, value: communication },
    { label: UI.skillsList.corr, value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = isArabic
      ? "مستعد لفرص العمل."
      : "Ready for job opportunities.";
    shortTagline = isArabic
      ? "وضوح ممتاز وإجابات مهيكلة."
      : "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = isArabic
      ? "تحتاج لتحسين بسيط قبل المقابلات."
      : "Needs minor improvement before interviews.";
    shortTagline = isArabic
      ? "أساس جيد، صقل طريقة النطق."
      : "Work foundation, refine articulation";
  } else {
    performanceText = isArabic
      ? "مطلوب تحسين كبير."
      : "Significant improvement required.";
    shortTagline = isArabic
      ? "اعمل على الوضوح والثقة."
      : "Work on clarity and confidence";
  }

  const percentage = (finalScore / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    // العنوان الرئيسي
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(137, 53, 176);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;
    doc.setDrawColor(137, 53, 176);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    // كرت النتيجة الكلية
    currentY += 15;
    doc.setFillColor(245, 235, 250);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    // ملخص المشاعر
    currentY += 35;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Emotional Sentiment Summary", margin, currentY);

    currentY += 8;
    doc.setFontSize(10);
    doc.setTextColor(100);
    const emotionText = Object.entries(processedEmotions)
      .filter(([_, val]) => val > 0)
      .map(([key, val]) => `${key.toUpperCase()}: ${val}%`)
      .join("  |  ");
    doc.text(
      emotionText || "No specific emotions detected",
      margin + 5,
      currentY,
    );

    // قسم المهارات
    currentY += 30;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    // قسم النصيحة المهنية الاحترافية
    currentY += 45;
    let advice = "";
    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    // الجدول التفصيلي للأسئلة والأجوبة
    currentY += 50;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        ["#", "Question", "Score", "Emotion", "Feedback", "Behavioral Tip"],
      ],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "",
        `${q.score}/10`,
        q.emotionalAnalysis || "Neutral",
        q.feedback || "",
        q.score < 6
          ? "You looked away frequently. Try to maintain a steady gaze."
          : "Great confidence! Professional and steady engagement.",
      ]), // تم إصلاح القوس المغلق هنا بنجاح 👍
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [137, 53, 176],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 25, halign: "center", fontStyle: "bold" },
        4: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-white-50 to-purple-50 px-4 sm:px-6 lg:px-10 py-8"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/history")}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition-all text-[#8935b0]"
          >
            <FaArrowLeft
              className={
                isArabic ? "rotate-180 text-gray-600" : "text-gray-600"
              }
            />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{UI.title}</h1>
            <p className="text-gray-500 mt-2">{UI.subTitle}</p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center justify-center gap-2 bg-[#8935b0] hover:bg-[#722a94] text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-300 font-semibold active:scale-95"
        >
          <span>{UI.download}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          {/* كرت النتيجة الكلية */}
          <motion.div
            initial={{ opacity: 0.9 }}
            className="bg-white rounded-3xl shadow-lg p-8 text-center border border-purple-100"
          >
            <h3 className="text-gray-500 mb-6">{UI.overall}</h3>
            <div className="relative w-24 h-24 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  pathColor: "#8935b0",
                  textColor: "#8935b0",
                  trailColor: "#f3e8ff",
                })}
              />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-gray-800">{performanceText}</p>
              <p className="text-purple-600 text-xs mt-1">{shortTagline}</p>
            </div>
          </motion.div>

          {/* تقييم المهارات */}
          <motion.div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
            <h3 className="text-base font-semibold text-gray-700 mb-6">
              {UI.skillTitle}
            </h3>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{s.label}</span>
                    <span className="font-semibold text-purple-600">
                      {s.value}
                    </span>
                  </div>
                  <div className="bg-purple-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* تتبع المشاعر */}
          <motion.div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
            <h3 className="text-base font-semibold text-gray-700 mb-6">
              {UI.emotionsTitle}
            </h3>
            <div className="space-y-5">
              {[
                {
                  label: isArabic ? "سعيد / إيجابي" : "Happy / Positive",
                  key: "happy",
                  color: "bg-green-500",
                },
                {
                  label: isArabic ? "محايد / هادئ" : "Neutral / Calm",
                  key: "neutral",
                  color: "bg-blue-500",
                },
                {
                  label: isArabic ? "متفاجئ" : "Surprised",
                  key: "surprised",
                  color: "bg-yellow-500",
                },
                {
                  label: isArabic ? "متوتر / حزين" : "Stressed / Sad",
                  key: "sad",
                  color: "bg-red-500",
                },
              ].map((emotion, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{emotion.label}</span>
                    <span className="font-semibold text-purple-600">
                      {processedEmotions[emotion.key] || 0}%
                    </span>
                  </div>
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${emotion.color} h-full`}
                      style={{
                        width: `${processedEmotions[emotion.key] || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* العمود العريض المفصل */}
        <div className="lg:col-span-2 space-y-6">
          {/* تشارت منحنى الأداء */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100"
          >
            <h3 className="text-base font-semibold text-gray-700 mb-6">
              {UI.trendTitle}
            </h3>
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8935b0"
                    fill="#e7c9f5"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* تفاصيل الأسئلة (الميزة التفاعلية للإجابة المثالية هنا) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100"
          >
            <h3 className="text-base font-semibold text-gray-700 mb-6">
              {UI.detailTitle}
            </h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-purple-200 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm flex-1 leading-relaxed">
                      <span className="text-[#8935b0]">
                        {isArabic ? `س${i + 1}:` : `Q${i + 1}:`}
                      </span>{" "}
                      {q.question || "Question not available"}
                    </h4>

                    <div className="flex items-center gap-2">
                      {/* 💡 أيقونة المصباح التفاعلية المضافة حديثاً */}
                      <button
                        onClick={() => toggleOptimal(i)}
                        className={`p-2 rounded-full transition-all ${
                          openOptimal[i]
                            ? "bg-yellow-400 text-white shadow-md"
                            : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        }`}
                        title="View Optimal Answer"
                      >
                        <FaLightbulb
                          className={openOptimal[i] ? "animate-pulse" : ""}
                        />
                      </button>

                      <span className="bg-purple-100 text-[#8935b0] px-4 py-1 rounded-full text-xs font-bold border border-purple-200">
                        {q.score ?? 0}/10
                      </span>
                    </div>
                  </div>

                  {/* القسم الحركي السلس لعرض الإجابة المثالية */}
                  {openOptimal[i] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl"
                    >
                      <p className="text-[10px] font-black text-yellow-700 uppercase mb-1 tracking-wider">
                        {UI.optimalTitle}
                      </p>
                      <p className="text-sm text-gray-800 italic leading-relaxed">
                        {q.optimalAnswer || UI.optimalLoading}
                      </p>
                    </motion.div>
                  )}

                  {/* الـ Feedback والنصائح السلوكية */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">
                        {UI.feedback}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {q.feedback && q.feedback.trim() !== ""
                          ? q.feedback
                          : "No feedback available."}
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                      <p className="text-[10px] font-black text-[#8935b0] uppercase mb-2 flex items-center gap-1 tracking-wider">
                        <FaLightbulb /> {UI.behavioral}
                      </p>
                      <p className="text-xs text-[#8935b0] italic leading-relaxed font-medium">
                        {q.score < 6
                          ? isArabic
                            ? "تجنب تشتيت النظر، حافظ على تواصل بصري واثق."
                            : "Avoid looking away, maintain confident eye contact."
                          : isArabic
                            ? "أداء واثق جداً وتفاعل احترافي."
                            : "Very confident performance and professional engagement."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;