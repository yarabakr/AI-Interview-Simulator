import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  FaArrowLeft,
  FaSearch,
  FaBriefcase,
  FaChevronRight,
  FaHistory,
  FaTrashAlt,
  FaPlayCircle,
  FaChartLine,
} from "react-icons/fa";
// استيراد مكتبة الرسم البياني
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedWorkspace, setExpandedWorkspace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyInterviews();
  }, []);

  const getMyInterviews = async () => {
    try {
      const result = await axios.get(
        ServerUrl + "/api/interview/get-interview",
        {
          withCredentials: true,
        },
      );
      setInterviews(result.data.filter((i) => !i.isDeleted));
    } catch (error) {
      console.log("Error fetching history:", error);
    }
  };

  const handleSoftDelete = async (id, e) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to remove this interview from history?",
      )
    )
      return;
    try {
      await axios.delete(`${ServerUrl}/api/interview/${id}`, {
        withCredentials: true,
      });
      setInterviews((prev) => prev.filter((item) => item._id !== id));
      alert("Interview deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const groupedInterviews = interviews.reduce((acc, interview) => {
    const key = interview.resumeId || interview.role;
    if (!acc[key]) {
      acc[key] = {
        role: interview.role,
        experience: interview.experience,
        sessions: [],
      };
    }
    acc[key].sessions.push(interview);
    return acc;
  }, {});

  const workspaces = Object.values(groupedInterviews).filter((ws) =>
    ws.role.toLowerCase().includes(search.toLowerCase()),
  );

  // دالة لتجهيز بيانات الرسم البياني لكل Workspace
  const prepareChartData = (sessions) => {
    return sessions
      .filter((s) => s.status === "completed")
      .map((s, index) => ({
        name: `S${index + 1}`,
        score: s.finalScore || 0,
      }))
      .reverse(); // لترتيبها من الأقدم للأحدث في الرسم البياني
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 text-[#8935b0] hover:scale-110 transition-all"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-black text-[#1D2146] tracking-tight">
                My <span className="text-[#8935b0]">Workspaces</span>
              </h1>
              <p className="text-gray-400 font-medium mt-1">
                Review and manage your professional growth
              </p>
            </div>
          </div>

          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#8935b0] transition-colors" />
            <input
              type="text"
              placeholder="Search by job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {/* WORKSPACE CARDS */}
        {workspaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400">
              No workspaces found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {workspaces.map((ws, idx) => {
              const chartData = prepareChartData(ws.sessions);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <div
                    onClick={() =>
                      setExpandedWorkspace(
                        expandedWorkspace === idx ? null : idx,
                      )
                    }
                    className="p-7 cursor-pointer flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8935b0] to-[#6b21a8] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                        <FaBriefcase size={26} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#1D2146]">
                          {ws.role}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">
                          {ws.sessions.length} Interview Sessions Recorded
                        </p>
                      </div>
                    </div>
                    <FaChevronRight
                      className={`text-gray-300 transition-transform duration-300 ${expandedWorkspace === idx ? "rotate-90" : ""}`}
                    />
                  </div>

                  {expandedWorkspace === idx && (
                    <div className="bg-[#FAF9FF] border-t border-gray-50 p-6 space-y-6">
                      {/* 📊 الرسم البياني الخاص بهذا الـ Workspace */}
                      {chartData.length > 1 && (
                        <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm mb-6">
                          <div className="flex items-center gap-2 mb-4 text-[#8935b0]">
                            <FaChartLine />
                            <span className="text-sm font-bold uppercase tracking-wider">
                              Improvement Journey
                            </span>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData}>
                                <defs>
                                  <linearGradient
                                    id={`colorScore-${idx}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#8935b0"
                                      stopOpacity={0.1}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#8935b0"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#f0f0f0"
                                />
                                <XAxis dataKey="name" hide />
                                <YAxis domain={[0, 10]} hide />
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="score"
                                  stroke="#8935b0"
                                  fill={`url(#colorScore-${idx})`}
                                  strokeWidth={3}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* SESSION LIST */}
                      <div className="space-y-4">
                        {ws.sessions.map((session, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all shadow-sm group"
                          >
                            <div className="flex items-center gap-5">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.status === "completed" ? "bg-purple-50 text-[#8935b0]" : "bg-yellow-50 text-yellow-600"}`}
                              >
                                {session.status === "completed" ? (
                                  <FaHistory />
                                ) : (
                                  <FaPlayCircle className="animate-pulse" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-700">
                                  Session #{ws.sessions.length - sIdx}
                                </p>
                                <span
                                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md ${
                                    session.status === "completed"
                                      ? "bg-purple-100 text-[#8935b0]"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {session.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {session.status !== "completed" ? (
                                <button
                                  onClick={() =>
                                    navigate(`/interview/${session._id}`)
                                  }
                                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-yellow-100"
                                >
                                  Continue <FaPlayCircle />
                                </button>
                              ) : (
                                <div className="text-right mr-4">
                                  <p className="text-lg font-black text-[#8935b0] leading-none">
                                    {session.finalScore}/10
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                                    Score
                                  </p>
                                </div>
                              )}

                              {session.status === "completed" && (
                                <button
                                  onClick={() =>
                                    navigate(`/report/${session._id}`)
                                  }
                                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#8935b0] hover:bg-purple-50 rounded-xl transition-all"
                                >
                                  <FaChevronRight />
                                </button>
                              )}

                              <button
                                onClick={(e) =>
                                  handleSoftDelete(session._id, e)
                                }
                                className="p-2.5 text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete Session"
                              >
                                <FaTrashAlt size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;