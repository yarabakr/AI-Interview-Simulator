import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "../redux/reviewSlice"; 
import { useNavigate } from "react-router-dom"; // قمنا بإضافة هذا السطر لتفعيل الانتقال لصفحة الـ Home
import { 
  BsGeoAlt, 
  BsEnvelope, 
  BsTelephone, 
  BsClock, 
  BsStarFill 
} from "react-icons/bs";

function Contact() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // هنا تم تعريف دالة التنقل بشكل صحيح لكي تعمل في الاسفل

  // حالات فورم التواصل التقليدي
  const [contactForm, setContactForm] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    subject: "General Inquiry", 
    message: "" 
  });

  // حالات فورم إضافة تقييم النجاح (الهوم دايناميك)
  const [reviewText, setReviewText] = useState("");
  const [userRole, setUserRole] = useState("");
  const [rating, setRating] = useState(5); // حالة التقييم بالنجوم الافتراضية
  const [hoverRating, setHoverRating] = useState(0); // تأثير حركة الماوس فوق النجوم
  const [submittedContact, setSubmittedContact] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittedContact(true);
    setContactForm({ fullName: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    setTimeout(() => setSubmittedContact(false), 4000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userData) {
      alert("Please log in to submit a live review!");
      return;
    }

    const newReview = {
      name: userData.name,
      role: userRole || "Candidate",
      text: reviewText,
      rating: rating, // إرسال التقييم الرقمي الفعلي المختار
    };

    dispatch(addReview(newReview));
    setSubmittedReview(true);
    setReviewText("");
    setUserRole("");
    setRating(5); // إعادة تعيين النجوم لـ 5 بعد الإرسال
    
    // عند نجاح الإرسال، سينتظر المستخدم ثانيتين لرؤية رسالة التأكيد المكتوبة بالأخضر، ثم ينتقل تلقائياً للـ Home
    setTimeout(() => {
      setSubmittedReview(false);
      navigate("/"); // الانتقال التلقائي إلى الصفحة الرئيسية لمشاهدة التقييم
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&family=Outfit:wght@300;400;600;800&display=swap');
          .font-title { font-family: 'Outfit', sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* الـ Navbar الخاص بك */}
      <Navbar />

      {/* ========================== 1. BANNER HEADER ========================== */}
      <section className="relative w-full bg-[#1D2146] pt-28 pb-24 text-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#8935b0_0%,transparent_70%)]" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-title text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-2">
            Contact Us
          </h1>
          {/* العنوان الفرعي الجديد (Subtitle) */}
          <p className="font-body text-sm md:text-base text-purple-200/80 mb-4 font-normal max-w-xl mx-auto leading-relaxed">
            Have questions about our AI Interview Simulator? Reach out to our technical team or share your experience live.
          </p>
         
        </div>

        {/* تأثير الموجة السفلي المقتبس من تصميمك */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,153.11,107.57,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* ========================== 2. INFO CARDS ========================== */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 -mt-10 relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <BsGeoAlt size={22} />,
            title: "Our Address",
            desc: "Beirut, Lebanon\nMain Tech District"
          },
          {
            icon: <BsEnvelope size={22} />,
            title: "info@AISimulator.com",
            desc: "Email us anytime for any kind of query."
          },
          {
            icon: <BsTelephone size={22} />,
            title: "+961\n1 345 678",
            desc: "24/7 Priority assistance for active users."
          },
          {
            icon: <BsClock size={22} />,
            title: "Instant AI Availability",
            desc: "24/7 Real-time AI simulator can access "
          }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 text-center flex flex-col items-center justify-center min-h-[180px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F3EBFF] text-[#8935b0] flex items-center justify-center mb-3">
              {card.icon}
            </div>
            <h4 className="font-title font-bold text-base text-[#1D2146] mb-1">
              {card.title}
            </h4>
            <p className="font-body text-xs text-[#6C757D] leading-relaxed max-w-[190px]">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ========================== 3. TWO FORMS SIDE-BY-SIDE + BACKGROUND COLOR + SHADOWS ========================== */}
      <section className="w-full bg-[#FDFBFF] border-t border-purple-50 py-20 mt-12">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* الفورم الأول: Get in Touch (الجهة اليسرى) مع إضافة ظل بارز وعميق */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100/70 shadow-[0_20px_50px_rgba(137,53,176,0.06)] hover:shadow-[0_20px_60px_rgba(137,53,176,0.09)] transition-shadow duration-300">
              <h2 className="font-title text-2xl font-black text-[#1D2146] mb-2">
                Get in Touch
              </h2>
              <p className="font-body text-xs text-[#6C757D] mb-6">
                Have questions or suggestions? Drop us a line below.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4 font-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text"
                    required
                    placeholder="Full Name"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
                    className="w-full bg-[#F8F9FF] border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146]"
                  />
                  <input 
                    type="email"
                    required
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full bg-[#F8F9FF] border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full bg-[#F8F9FF] border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146]"
                  />
                  <select 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full bg-[#F8F9FF] border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Business Partnership">Business Partnership</option>
                  </select>
                </div>

                <textarea 
                  rows="4"
                  required
                  placeholder="Messages"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-[#F8F9FF] border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146] resize-none"
                />

                <div className="flex items-start gap-2.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-[#8935b0] mt-1.5 flex-shrink-0" />
                  <p className="text-[11px] text-[#6C757D] leading-normal">
                    Collaboratively formulate principle capital. Progressively evolve user feedback loops.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#8935b0] hover:bg-[#732a96] text-white py-3.5 rounded-xl font-bold font-title text-xs transition-all shadow-md uppercase tracking-wider mt-2"
                >
                  Submit Now
                </button>

                {submittedContact && (
                  <p className="text-xs font-bold text-green-600 mt-2 text-center">✓ Message sent successfully!</p>
                )}
              </form>
            </div>

            {/* الفورم الثاني: Add Your Live Success Story (الجهة اليمنى) مع إضافة ظل متطابق ومتناسق */}
            <div className="bg-[#F9F5FF] p-8 rounded-3xl border border-purple-100/60 shadow-[0_20px_50px_rgba(137,53,176,0.05)] hover:shadow-[0_20px_60px_rgba(137,53,176,0.08)] transition-shadow duration-300 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-title text-2xl font-black text-[#1D2146] mb-2">
                  Add Your Live Success Story
                </h3>
                <p className="font-body text-xs text-[#6C757D] mb-6">
                  Your avatar, role, and evaluation will render on the dashboard's landing hero instantaneously.
                </p>

                {userData ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 font-body">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-[#E9D8FD] text-[#8935b0] flex items-center justify-center font-bold text-xs">
                          {userData.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-[#1D2146] truncate">{userData.name}</span>
                      </div>
                      <input 
                        type="text"
                        required
                        placeholder="Your Target Role (e.g. React Developer)"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full bg-white border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146] shadow-sm"
                      />
                    </div>

                    <textarea 
                      rows="4"
                      required
                      placeholder="Review Details (How the simulation tool helped you ace your interview...)"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-white border border-gray-200/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8935b0] text-[#1D2146] resize-none shadow-sm"
                    />

                    {/* نظام التقييم بالنجوم الحقيقي والتفاعلي */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#6C757D]">Your Rating:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none transition-transform transform hover:scale-125 duration-150"
                            >
                              <BsStarFill 
                                size={22} 
                                className={`${
                                  star <= (hoverRating || rating) 
                                    ? "text-[#FFB800]" 
                                    : "text-gray-200"
                                } transition-colors duration-150`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="bg-[#1D2146] hover:bg-[#2c3266] text-white px-6 py-3.5 rounded-xl text-xs font-bold font-title transition-all uppercase tracking-wider shadow-sm self-end"
                      >
                        Publish to Homepage
                      </button>
                    </div>

                    {submittedReview && (
                      <p className="text-xs font-bold text-green-600 text-center mt-4">✓ Review & Rating injected into active memory layout!</p>
                    )}
                  </form>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-6 text-center my-auto">
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Authentication needed. Please use the core application gateway to sign in before providing test metrics.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* الـ Footer الخاص بك */}
      <Footer />
    </div>
  );
}

export default Contact;