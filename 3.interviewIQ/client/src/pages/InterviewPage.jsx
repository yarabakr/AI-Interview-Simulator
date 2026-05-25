import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import Step1SetUp from "../components/Step1SetUp";
import Step2InterviewAr from "../components/Step2InterviewAr";
import Step2InterviewEn from "../components/Step2InterviewEn";
import Step3Report from "../components/Step3Report";

function InterviewPage() {
  const { id } = useParams(); // التقاط المعرف من الرابط
  const [step, setStep] = useState(0); //  تبدأ بـ 0 للقيام بفحص الحالة أولاً
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(!!id); //  شاشة تحميل إذا كان هناك ID
  const [selectedLang, setSelectedLang] = useState("en"); //  حظّ الحفاظ على اللغة الافتراضية

  useEffect(() => {
    const fetchExistingInterview = async () => {
      if (id) {
        try {
          const result = await axios.get(
            `${ServerUrl}/api/interview/get-interview-by-id/${id}`,
            {
              withCredentials: true,
            },
          );

          if (result.data) {
            setInterviewData(result.data);
            // إذا كانت المقابلة مكتملة اذهب للتقرير، وإلا اذهب للمقابلة
            setStep(result.data.status === "completed" ? 3 : 2);
          }
        } catch (error) {
          console.error("Error resuming interview:", error);
          setStep(1); // في حال الخطأ نعود للبداية
        } finally {
          setLoading(false);
        }
      } else {
        setStep(1); // لا يوجد ID، ابدأ مقابلة جديدة
      }
    };

    fetchExistingInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8935b0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الخطوة الأولى: الإعداد (يأخذ البيانات القديمة إن وُجدت  ) */}
      {step === 1 && (
        <Step1SetUp
          existingData={interviewData}
          onStart={(data) => {
            // [دمج ذكي] دمج لغة الإعداد مع البيانات لضمان التوجيه الصحيح للغة
            setInterviewData({
              ...data,
              language: data.language || selectedLang,
            });
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <>
          {interviewData?.language === "ar" ? (
            <Step2InterviewAr
              interviewData={interviewData}
              onFinish={(report) => {
                setInterviewData(report);
                setStep(3);
              }}
            />
          ) : (
            <Step2InterviewEn
              interviewData={interviewData}
              onFinish={(report) => {
                setInterviewData(report);
                setStep(3);
              }}
            />
          )}
        </>
      )}

      {step === 3 && <Step3Report report={interviewData} />}
    </div>
  );
}

export default InterviewPage;