import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "$10",
      credits: 300,
      description: "Great for focused practice and skill improvement.",
      features: [
        "300 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "$20",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] relative overflow-hidden font-sans py-20 px-6">
      {/* تأثير الشبكة (Grid) في الخلفية */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header - صار الآن ممركز في المنتصف تماماً (text-center) */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Flexible pricing to match your goals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -10 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-[40px] p-10 border transition-all duration-300
                  ${isSelected ? "border-[#8935B0] shadow-[0_20px_50px_rgba(137,53,176,0.1)]" : "border-gray-100 shadow-sm"}
                  ${plan.default ? "cursor-default" : "cursor-pointer"}
                `}
              >
                {/* Badge / Default Tag */}
                {(plan.badge || plan.default) && (
                  <div
                    className={`absolute top-8 right-8 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                    ${plan.badge ? "bg-[#8935B0] text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {plan.badge || "Default"}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-[#8935B0] tracking-tighter">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 italic text-sm">
                      / {plan.credits} Credits
                    </span>
                  </div>
                </div>

                {!plan.default && (
                  <button
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 mb-10 shadow-lg flex items-center justify-center gap-2
                      ${
                        isSelected
                          ? "bg-[#8935B0] text-white hover:bg-black"
                          : "bg-gray-50 text-gray-600 hover:bg-[#8935B0] hover:text-white"
                      }`}
                  >
                    {isSelected ? "Proceed to Pay" : "Select Plan"}
                  </button>
                )}

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#8935B0]/10 flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-[#8935B0] text-sm" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* زر الرجوع في الأسفل - ممركز وأنيق */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-gray-400 hover:text-[#8935B0] font-bold transition-all duration-300"
          >
            <span className="border-b-2 border-transparent group-hover:border-[#8935B0] pb-1 transition-all">
              Back to Home
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;