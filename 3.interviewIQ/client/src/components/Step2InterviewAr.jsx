import React, { useState, useEffect, useRef } from "react";

import maleVideo from "../assets/male-ai.mp4";

import femaleVideo from "../assets/female-ai.mp4";

import Timer from "./Timer";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaUserTie,
  FaLightbulb,
} from "react-icons/fa";

import axios from "axios";

import { ServerUrl } from "../App";

import { BsArrowRight } from "react-icons/bs";

import * as faceapi from "face-api.js";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName, language = "ar" } = interviewData;

  const isArabic = language === "ar";

  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);

  const recognitionRef = useRef(null);

  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState("");

  const [behavioralAdvice, setBehavioralAdvice] = useState("");

  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [voiceGender, setVoiceGender] = useState("female");

  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  const userVideoRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [currentEmotion, setCurrentEmotion] = useState("Neutral");

  const [emotionHistory, setEmotionHistory] = useState([]);

  const UI_TEXT = {
    title: isArabic ? "مقابلة الذكاء الاصطناعي الذكية" : "Smart AI Interview",

    activeQuestion: isArabic ? "السؤال الحالي" : "Active Question",

    placeholder: isArabic
      ? "ابدأ بالتحدث لإضافة إجابتك..."
      : "Start speaking your answer...",

    aiSpeaking: isArabic ? "الذكاء الاصطناعي يتحدث..." : "AI is speaking...",

    analyzing: isArabic ? "جاري تحليل الأداء..." : "Analyzing Performance...",

    finishBtn: isArabic ? "إنهاء الإجابة" : "Finish Answer",

    nextBtn: isArabic ? "السؤال التالي" : "Next Question",

    feedbackTitle: isArabic ? "تقييم فوري" : "Immediate Feedback",

    switchAI: isArabic ? "تبديل المحاور" : "Switch AI",

    note: isArabic ? "ملاحظة المحاور" : "Interviewer's Note",

    question: isArabic ? "سؤال" : "Question",

    total: isArabic ? "الإجمالي" : "Total",
  }; // تحميل موديلات تحليل الوجه

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),

          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models", error);
      }
    };

    loadModels();
  }, []); // فتح الكاميرا

  useEffect(() => {
    if (modelsLoaded) {
      navigator.mediaDevices

        .getUserMedia({ video: {} })

        .then((stream) => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        })

        .catch((err) => console.error("Camera error:", err));
    }
  }, [modelsLoaded]);

  const handleUserVideoPlay = () => {
    setInterval(async () => {
      if (userVideoRef.current && modelsLoaded) {
        const detections = await faceapi

          .detectAllFaces(
            userVideoRef.current,

            new faceapi.TinyFaceDetectorOptions(),
          )

          .withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;

          const bestEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b,
          );

          setCurrentEmotion(bestEmotion);

          if (!isIntroPhase && !feedback)
            setEmotionHistory((prev) => [...prev, bestEmotion]);
        }
      }
    }, 1000);
  };

  const currentQuestion = questions[currentIndex]; // إعداد ميزة التعرف على الصوت

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();

      recognition.lang = isArabic ? "ar-SA" : "en-US";

      recognition.continuous = true;

      recognition.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;

        setAnswer((prev) => prev + " " + transcript);
      };

      recognition.onend = () => {
        if (isMicOn && !isAIPlaying && !isSubmitting) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isMicOn, isAIPlaying, isSubmitting, isArabic]);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying)
      try {
        recognitionRef.current.start();
      } catch (e) {}
  };

  const stopMic = () => {
    if (recognitionRef.current)
      try {
        recognitionRef.current.stop();
      } catch (e) {}
  };

  const toggleMic = () => {
    isMicOn ? stopMic() : startMic();

    setIsMicOn(!isMicOn);
  }; // دالة نطق النصوص عبر السيرفر

  const speakText = async (text) => {
    if (!text) return;

    return new Promise(async (resolve) => {
      stopMic();

      setIsAIPlaying(true);

      setSubtitle(text);

      try {
        const response = await axios.post(
          `${ServerUrl}/api/interview/generate-speech`,

          { text, gender: voiceGender },

          {
            withCredentials: true,

            timeout: 20000, // مهلة 20 ثانية لأن توليد النصوص الطويلة يستغرق وقتاً
          },
        );

        const audioUrl = `data:audio/mp3;base64,${response.data.audioContent}`;

        const audio = new Audio(audioUrl);

        audio.onplay = () => {
          if (videoRef.current) {
            videoRef.current

              .play()

              .catch((e) => console.error("Video Error:", e));
          }
        };

        audio.onended = () => {
          setIsAIPlaying(false);

          if (videoRef.current) videoRef.current.pause();

          setSubtitle("");

          if (isMicOn) startMic();

          resolve();
        };

        audio.onerror = () => {
          setIsAIPlaying(false);

          resolve(); // نكمل المقابلة حتى لو فشل تشغيل الصوت
        };

        await audio.play();
      } catch (error) {
        console.error("TTS Connection Error:", error);

        setIsAIPlaying(false); // في حال حدوث خطأ 500، ننتظر ثانيتين ثم نكمل نصياً لكي لا تتعطل المقابلة

        setTimeout(resolve, 2000);
      }
    });
  }; // المايسترو لتنظيم تسلسل المقابلة

  useEffect(() => {
    const runSequence = async () => {
      if (isIntroPhase) {
        const intro = isArabic
          ? `مرحباً ${userName}، لنبدأ المقابلة. سأراقب أداءك بعناية.`
          : `Hi ${userName}, let's start the interview. I'll monitor your performance carefully.`;

        await speakText(intro);

        setIsIntroPhase(false);
      } else if (currentQuestion && !feedback && !isAIPlaying) {
        await speakText(currentQuestion.question);
      }
    };

    runSequence();
  }, [isIntroPhase, currentIndex]);

  // كود تشغيل التايمر

  useEffect(() => {
    let timer;

    // يعمل التايمر فقط إذا لم نكن في مرحلة المقدمة، ولا يوجد تقييم معروض، والذكاء الاصطناعي لا يتحدث

    if (!isIntroPhase && !feedback && !isAIPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    // إذا انتهى الوقت، قم بتسليم الإجابة تلقائياً

    if (timeLeft === 0 && !feedback && !isSubmitting) {
      submitAnswer();
    }

    return () => clearInterval(timer); // تنظيف التايمر عند التوقف
  }, [isIntroPhase, feedback, isAIPlaying, timeLeft, isSubmitting]);

  const submitAnswer = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    stopMic();

    const mostFrequentEmotion =
      emotionHistory.length > 0
        ? [...emotionHistory]

            .sort(
              (a, b) =>
                emotionHistory.filter((v) => v === a).length -
                emotionHistory.filter((v) => v === b).length,
            )

            .pop()
        : currentEmotion;

    const advice = getBehavioralAdvice(mostFrequentEmotion);

    setBehavioralAdvice(advice);

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,

        {
          interviewId,

          questionIndex: currentIndex,

          answer,

          timeTaken: (currentQuestion?.timeLimit || 60) - timeLeft,

          emotionalAnalysis: mostFrequentEmotion,

          language,
        },

        { withCredentials: true },
      ); // الكود القديم (يسبب ضغط على السيرفر)

      // الكود الجديد (أكثر استقراراً)

      setFeedback(result.data.feedback);

      const introText = isArabic ? "بخصوص إجابتك: " : "Regarding your answer: "; // دمج النصيحة والتقييم في طلب صوتي واحد

      const fullSpeechText = `${advice}. ${introText} ${result.data.feedback}`;

      await speakText(fullSpeechText);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBehavioralAdvice = (emotion) => {
    const advices = isArabic
      ? {
          sad: "تبدو متوتراً، حاول الابتسام.",

          happy: "أداء رائع وثقة ممتازة!",

          neutral: "حاول إظهار تفاعل أكبر بوجهك.",

          fearful: "لا تقلق، ركز وتحدث بوضوح.",
        }
      : {
          sad: "You look stressed, try to smile.",

          happy: "Great confidence!",

          neutral: "Try to show more engagement.",

          fearful: "Don't worry, speak clearly.",
        };

    return (
      advices[emotion] ||
      (isArabic ? "حاول الحفاظ على التواصل البصري." : "Maintain eye contact.")
    );
  };

  const handleNext = () => {
    setAnswer("");

    setFeedback("");

    setBehavioralAdvice("");

    setEmotionHistory([]);

    if (currentIndex + 1 >= questions.length) finishInterview();
    else {
      setCurrentIndex((prev) => prev + 1);

      setTimeLeft(questions[currentIndex + 1]?.timeLimit || 60);
    }
  };

  const finishInterview = async () => {
    stopMic();

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,

        { interviewId },

        { withCredentials: true },
      );

      onFinish(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f6ff] flex items-center justify-center p-4 font-sans"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* كاميرا المستخدم */}{" "}
      <div
        className={`fixed bottom-6 ${isArabic ? "left-6" : "right-6"} w-60 h-45 border-4 border-[#8935b0] rounded-2xl overflow-hidden shadow-2xl z-50 bg-black`}
      >
        {" "}
        <video
          ref={userVideoRef}
          autoPlay
          muted
          loop
          onPlay={handleUserVideoPlay}
          className="w-full h-full object-cover scale-x-[-1]"
        />{" "}
        <div className="absolute bottom-0 w-full bg-[#8935b0]/90 text-white text-[10px] text-center py-1 font-bold uppercase">
          {isArabic ? "مباشر" : "Live"}: {currentEmotion}{" "}
        </div>{" "}
      </div>{" "}
      <div className="w-full max-w-[1300px] bg-white rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden relative">
        {" "}
        <AnimatePresence>
          {" "}
          {behavioralAdvice && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-10 ${isArabic ? "left-10" : "right-10"} z-40 bg-white p-4 rounded-2xl shadow-xl border-l-4 border-[#8935b0]`}
            >
              {" "}
              <div className="flex items-center gap-2 text-[#8935b0] mb-2 font-bold text-sm">
                <FaLightbulb /> {UI_TEXT.note}{" "}
              </div>{" "}
              <p className="text-xs text-gray-600 italic">
                "{behavioralAdvice}"{" "}
              </p>{" "}
            </motion.div>
          )}{" "}
        </AnimatePresence>
        {/* قسم المحاور */}{" "}
        <div className="w-full lg:w-[38%] p-8 bg-[#fdfbff] border-x border-purple-50 flex flex-col items-center">
          {" "}
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative mb-6">
            {" "}
            <video
              src={voiceGender === "male" ? maleVideo : femaleVideo}
              ref={videoRef}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />{" "}
            <button
              onClick={() =>
                setVoiceGender((prev) =>
                  prev === "female" ? "male" : "female",
                )
              }
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-full text-white text-xs font-bold flex items-center gap-2"
            >
              <FaUserTie /> {UI_TEXT.switchAI}{" "}
            </button>{" "}
          </div>{" "}
          {subtitle && (
            <div className="w-full bg-white border rounded-2xl p-5 text-center text-sm italic mb-4">
              "{subtitle}"{" "}
            </div>
          )}{" "}
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            {" "}
            <Timer
              timeLeft={timeLeft}
              totalTime={currentQuestion?.timeLimit || 60}
            />{" "}
            <div className="flex justify-between mt-4">
              {" "}
              <div className="text-center">
                {" "}
                <span className="block text-lg font-bold text-[#8935b0]">
                  {currentIndex + 1}{" "}
                </span>{" "}
                <span className="text-[10px] text-gray-400 font-bold">
                  {UI_TEXT.question}{" "}
                </span>{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <span className="block text-lg font-bold text-gray-400">
                  {questions.length}{" "}
                </span>{" "}
                <span className="text-[10px] text-gray-400 font-bold">
                  {UI_TEXT.total}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        {/* قسم الأسئلة */}{" "}
        <div className="flex-1 p-10 flex flex-col">
          {" "}
          <header className="mb-8">
            {" "}
            <h2 className="text-2xl font-black text-gray-800">
              {UI_TEXT.title}{" "}
            </h2>{" "}
            <div className="h-1 w-12 bg-[#8935b0] mt-2 rounded-full"></div>{" "}
          </header>{" "}
          {!isIntroPhase && (
            <div className="mb-8 bg-[#faf9ff] p-8 rounded-[2rem] border border-purple-50 relative">
              {" "}
              <span
                className={`absolute -top-3 ${isArabic ? "right-6" : "left-6"} bg-[#8935b0] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase`}
              >
                {UI_TEXT.activeQuestion}{" "}
              </span>{" "}
              <p className="text-xl font-medium text-gray-800">
                {currentQuestion?.question}{" "}
              </p>{" "}
            </div>
          )}{" "}
          <div className="flex-1 relative">
            {" "}
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-full h-full p-8 bg-gray-50 rounded-[2rem] outline-none text-lg shadow-inner ${isArabic ? "text-right" : "text-left"}`}
              placeholder={UI_TEXT.placeholder}
            />{" "}
            {isAIPlaying && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center font-bold text-[#8935b0]">
                {UI_TEXT.aiSpeaking}{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="mt-8 flex gap-5">
            {" "}
            <button
              onClick={toggleMic}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl ${isMicOn ? "bg-[#8935b0] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {" "}
              {isMicOn ? (
                <FaMicrophone size={24} />
              ) : (
                <FaMicrophoneSlash size={24} />
              )}{" "}
            </button>{" "}
            {!feedback ? (
              <button
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying || !answer.trim()}
                className="flex-1 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-[#8935b0] disabled:bg-gray-200 transition-all"
              >
                {" "}
                {isSubmitting ? UI_TEXT.analyzing : UI_TEXT.finishBtn}{" "}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-[#8935b0] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3"
              >
                {UI_TEXT.nextBtn}{" "}
                <BsArrowRight
                  size={22}
                  className={isArabic ? "rotate-180" : ""}
                />{" "}
              </button>
            )}{" "}
          </div>{" "}
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-purple-50 p-6 rounded-2xl border border-purple-100"
            >
              {" "}
              <h4 className="text-[#8935b0] font-bold text-xs uppercase mb-2">
                {UI_TEXT.feedbackTitle}{" "}
              </h4>
              <p className="text-gray-700 text-sm">{feedback}</p>{" "}
            </motion.div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Step2Interview;