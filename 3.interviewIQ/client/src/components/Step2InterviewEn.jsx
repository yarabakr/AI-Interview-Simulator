import React, { useState, useEffect, useRef } from "react";
import maleVideo from "../assets/male-ai.mp4";
import femaleVideo from "../assets/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaUserTie,
  FaUser,
  FaLightbulb,
} from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";
import * as faceapi from "face-api.js";

function Step2InterviewEn({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [behavioralAdvice, setBehavioralAdvice] = useState(""); // النصيحة السلوكية الفورية
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);

  const userVideoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("Neutral");
  const [emotionHistory, setEmotionHistory] = useState([]);

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
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
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
          if (!isIntroPhase && !feedback) {
            setEmotionHistory((prev) => [...prev, bestEmotion]);
          }
        }
      }
    }, 1000);
  };

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      let voice = voices.find((v) =>
        voiceGender === "female"
          ? /zira|samantha|female|google uk english female/i.test(
              v.name.toLowerCase(),
            )
          : /david|mark|male|google uk english male/i.test(
              v.name.toLowerCase(),
            ),
      );
      setSelectedVoice(voice || voices[0]);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [voiceGender]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;
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
  }, [isMicOn, isAIPlaying, isSubmitting]);

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
    if (isMicOn) stopMic();
    else startMic();
    setIsMicOn(!isMicOn);
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      stopMic();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = 0.95;
      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play();
      };
      utterance.onend = () => {
        setIsAIPlaying(false);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setSubtitle("");
        if (isMicOn) startMic();
        setTimeout(resolve, 300);
      };
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runSequence = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, let's start your interview. I'll be watching your performance closely.`,
        );
        setIsIntroPhase(false);
      } else if (currentQuestion && !feedback) {
        await speakText(currentQuestion.question);
      }
    };
    runSequence();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase || isAIPlaying || feedback || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, isAIPlaying, feedback, timeLeft]);

  // دالة لتوليد نصيحة سلوكية بناءً على المشاعر
  const getBehavioralAdvice = (emotion) => {
    const advices = {
      sad: "I noticed you looked a bit down or stressed. Try to smile and keep your head up.",
      angry:
        "You seemed a bit tense or frustrated. Remember to breathe and stay calm.",
      fearful:
        "You look a bit nervous. Don't worry, just focus on the camera and speak confidently.",
      disappointed:
        "Your energy seemed a bit low. Let's try to be more enthusiastic in the next one.",
      neutral:
        "Your expression was a bit flat. Try to show more engagement with your facial expressions.",
      happy: "Great job! You look confident and positive. Keep that energy up!",
    };
    return (
      advices[emotion] || "Try to maintain more eye contact with the camera."
    );
  };

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
          interviewId: interviewData._id || interviewData.interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion?.timeLimit || 60) - timeLeft,
          emotionalAnalysis: mostFrequentEmotion,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      // الـ AI ينطق النصيحة السلوكية أولاً ليعطيه طابعاً بشرياً
      await speakText(advice);
      await speakText("Regarding your answer: " + result.data.feedback);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitting && !feedback && !isIntroPhase)
      submitAnswer();
  }, [timeLeft]);

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
    const idToSend =
      interviewData._id || interviewData.interviewId || interviewId;
    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,
        { interviewId: idToSend },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleGender = () =>
    setVoiceGender((prev) => (prev === "female" ? "male" : "female"));
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  return (
    <div className="min-h-screen bg-[#f8f6ff] flex items-center justify-center p-4 font-sans">
      {/* نافذة كاميرا المستخدم */}
      <div className="fixed bottom-6 right-6 w-70 h-50 border-4 border-[#8935b0] rounded-2xl overflow-hidden shadow-2xl z-50 bg-black transition-transform hover:scale-105">
        <video
          ref={userVideoRef}
          autoPlay
          muted
          onPlay={handleUserVideoPlay}
          className="w-full h-full object-cover scale-x-[-1]"
        />
        <div className="absolute bottom-0 w-full bg-[#8935b0]/90 text-white text-[10px] text-center py-1 font-bold uppercase tracking-wider">
          Live: {currentEmotion}
        </div>
      </div>

      <div className="w-full max-w-[1300px] bg-white rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-purple-100 relative">
        {/* نصيحة المقابل الفورية (Floating Advice Card) */}
        <AnimatePresence>
          {behavioralAdvice && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="absolute top-10 right-10 z-40 bg-white p-4 rounded-2xl shadow-xl border-r-4 border-[#8935b0]"
            >
              <div className="flex items-center gap-2 text-[#8935b0] mb-2 font-bold text-sm">
                <FaLightbulb /> Interviewer's Note
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "{behavioralAdvice}"
              </p>
            </motion.div>
          )}{" "}
          {/* القوس ) كان ناقصاً هنا قبل الـ } */}
        </AnimatePresence>

        {/* Video Side */}
        <div className="w-full lg:w-[38%] p-8 bg-[#fdfbff] border-r border-purple-50 flex flex-col items-center">
          <div className="w-full  rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative mb-6">
            <video
              src={videoSource}
              ref={videoRef}
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleGender}
              className="absolute top-4 right-4 bg-black/40 hover:bg-[#8935b0] backdrop-blur-md p-3 rounded-full transition-all text-white text-xs font-bold flex items-center gap-2"
            >
              {voiceGender === "female" ? <FaUserTie /> : <FaUser />} Switch AI
            </button>
          </div>

          <div className="w-full space-y-4">
            {subtitle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-white border border-purple-100 rounded-2xl p-5 shadow-sm text-center text-gray-700 text-sm italic min-h-[80px] flex items-center justify-center"
              >
                "{subtitle}"
              </motion.div>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
              <div className="flex justify-between mt-4 px-2">
                <div className="text-center">
                  <span className="block text-lg font-bold text-[#8935b0]">
                    {currentIndex + 1}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">
                    Question
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-400">
                    {questions.length}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">
                    Total
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Side */}

        <div className="flex-1 p-8 flex flex-col relative">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className="mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </p>
            </div>
          )}

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 p-6 bg-gray-100 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 transition resize-none text-gray-800"
            placeholder="Speak or type your answer here..."
          />

          <div className="mt-6 flex gap-4">
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white ${isMicOn ? "bg-purple-600" : "bg-black"}`}
            >
              {isMicOn ? (
                <FaMicrophone size={24} />
              ) : (
                <FaMicrophoneSlash size={24} />
              )}
            </motion.button>

            {!feedback ? (
              <button
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-lg disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                Next Question <BsArrowRight size={20} />
              </button>
            )}
          </div>
          {feedback && (
            <div className="mt-6 bg-purple-50 border border-purple-200 p-5 rounded-2xl text-purple-700 font-medium shadow-sm">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2InterviewEn;