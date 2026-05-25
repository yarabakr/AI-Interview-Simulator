import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import { time } from "console";
import Resume from "../models/resume.model.js";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `
          Extract structured data from resume .
          
          Return ONLY valid JSON :

          {
          "role" : "string",
          "experience": "string",
          "projects": ["project1", "project2"],
          "skills": ["skill1", "skill2"] 
          }
          `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);
    const resume = await Resume.create({
      userId: req.userId,
      jopTittle: parsed.role,
      resumeText: resumeText,
    });

    fs.unlinkSync(filepath);

    res.json({
      resumeId: resume._id,
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ messages: error.message });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    let {
      role,
      experience,
      mode,
      resumeText,
      projects,
      skills,
      numQuestions,
      language = "en",
      resumeId,
    } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();
    numQuestions = Number(numQuestions) || 5;

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, experience and mode are required" });
    }

    if (numQuestions < 1 || numQuestions > 15) {
      return res
        .status(400)
        .json({ message: "Number of questions must be between 1 and 15" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 50) {
      return res
        .status(400)
        .json({ message: "Not enough credits. Minimum 50 required" });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(",") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(",") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
      Role :${role}
      Experience: ${experience}
      InterviewMode: ${mode}
      Projects: ${projectText}
      Skills: ${skillsText}
      Resume: ${safeResume}
      Language: ${language} // NEW
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({ message: "Prompt content is empty" });
    }

    const messages = [
      {
        role: "system",
        content: `

          You are a real human interviewer conducting a professional interview.
          
          Speak in simple, natural ${language === "ar" ? "Arabic" : "English"} as if you are directly talking to the candidate.

          Generate exactly ${numQuestions} interview questions.

          Strict Rules:
          -Each question must contain between 15 and 25 words.
          -Each question must be a single complete sentence.
          -Do Not number them.
          -Do Not add explanations.
          -Do Not add extra text before or after.
          -One question per line only.
          -Keep language simple and conversational.
          -Questions must feel practical and realistic.

      Difficulty progression:
      Start easy → end hard progressively.

      Make questions based on the candidate's role, experience, interviewMode, skills, projects and resume details.

      `,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);
    if (!aiResponse || !aiResponse.trim()) {
      console.log("AI returned empty questions");
      return res.status(500).json({ message: "AI returned empty questions" });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, numQuestions);

    if (questionsArray.length === 0) {
      console.log("AI failed to generate questions");
      return res
        .status(500)
        .json({ message: "AI failed to generate questions" });
    }

    const getDifficulty = (i, total) => {
      if (i < total * 0.3) return "easy";
      if (i < total * 0.7) return "medium";
      return "hard";
    };

    const getTimeLimit = (difficulty) => {
      if (difficulty === "easy") return 60;
      if (difficulty === "medium") return 90;
      return 120;
    };

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      resumeId: resumeId,
      role,
      experience,
      mode,
      language, // NEW
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => {
        const difficulty = getDifficulty(index, numQuestions);
        return {
          question: q,
          difficulty,
          timeLimit: getTimeLimit(difficulty),
        };
      }),
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `failed to create interview${error}` });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken, emotionalAnalysis } =
      req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];

    // حفظ المشاعر في قاعدة البيانات لكل سؤال
    question.emotionalAnalysis = emotionalAnalysis || "Neutral";

    // NEW: نجهز حالة خاصة للـ AI ليعرف لماذا نقوم بالطلب حتى في حال عدم وجود إجابة
    let promptCondition = "";
    if (!answer)
      promptCondition =
        interview.language === "ar"
          ? "ملاحظة: المرشح لم يقدم إجابة."
          : "Note: The candidate did not provide any answer.";
    if (timeTaken > question.timeLimit)
      promptCondition =
        interview.language === "ar"
          ? `ملاحظة: المرشح تجاوز الوقت المحدد (${timeTaken} ثانية).`
          : `Note: The candidate exceeded the time limit. They took ${timeTaken} seconds.`;
    const messages = [
      {
        role: "system",
        content: `
           You are a professional human interviewer. Evaluate the candidate's answer.
           
           Respond in ${interview.language === "ar" ? "Arabic" : "English"}.

           IMPORTANT: You are also watching the candidate through the camera. 
           The candidate's detected emotion during this answer was: ${emotionalAnalysis || "Neutral"}.

           ${promptCondition}

           Instructions:
           1. Evaluate Confidence, Communication, and Correctness (0-10).
           2. In your feedback, mention their behavior if it's relevant. 
              - If they were 'sad' or 'fearful', tell them they look nervous and should relax.
              - If they were 'happy' or 'neutral', praise their professional composure.
              - Sound like a real person talking to them.
           
           3. Final Score = Average of the three metrics.

             4. Provide the "optimalAnswer": What is the best possible professional answer to this question based on the candidate's background?
           

           Return Only valid JSON:
           {
             "confidence": number,
             "communication": number,
             "correctness": number,
             "finalScore": number,
             "feedback": "short human feedback (15-20 words) mentioning their delivery/emotions",
               "optimalAnswer": "detailed ideal response (40-60 words)",
             
           }
        `,
      },
      {
        role: "user",
        content: `
          Question: ${question.question}
          Answer: ${answer || "No answer provided"}
        `,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = JSON.parse(aiResponse);

    if (!answer) {
      question.score = 0; // لم يتم لمسها
      // NEW: رسالتك الأصلية + تعليق AI التعليمي
      question.feedback =
        interview.language === "ar"
          ? `لم تقدم إجابة، حاول أن تكون أكثر تفاعلاً. ${parsed.feedback}`
          : `You did not submit an answer. Try to be more communicative next time. ${parsed.feedback}`;
      question.answer = ""; // لم يتم لمسها

      await interview.save();
      return res.json({
        feedback: question.feedback,
      });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0; // لم يتم لمسها
      // NEW: رسالتك الأصلية + تعليق AI التعليمي
      question.feedback =
        interview.language === "ar"
          ? `تم تجاوز الوقت المحدد. لقد استغرقت ${timeTaken} ثانية. يرجى محاولة جعل إجابتك مختصرة ومباشرة. ${parsed.feedback}`
          : `Time limit exceeded. You took ${timeTaken} seconds. Please keep your answers concise. ${parsed.feedback}`;
      question.answer = answer; // لم يتم لمسها

      await interview.save();
      return res.json({
        feedback: question.feedback,
        optimalAnswer: question.optimalAnswer,
      });
    }

    // الحالة الطبيعية: الكود الأصلي بالكامل مع دمج حقل optimalAnswer
    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    question.optimalAnswer = parsed.optimalAnswer;

    await interview.save();

    return res.status(200).json({
      feedback: parsed.feedback,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `failed to submit answer ${error}` });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(400).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",

        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        emotionalAnalysis: q.emotionalAnalysis || "Neutral",
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to finish interview ${error}` });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interview = await Interview.find({
      userId: req.userId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interview);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to find currentUser Interview ${error}` });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "userId",
      "name",
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    return res.json({
      _id: interview._id,
      role: interview.role,
      experience: interview.experience,
      mode: interview.mode,
      resumeText: interview.resumeText,
      resumeId: interview.resumeId,
      status: interview.status,
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questions: interview.questions, // نرسلها باسم questions ليتعرف عليها Step2
      questionWiseScore: interview.questions, // للملاءمة مع كود التقرير ال
      userName: interview.userId?.name || "Candidate",
    });
  } catch (error) {
    console.error("REPORT ERROR:", error);
    return res.status(500).json({
      message: `failed to find currentUser Interview report ${error}`,
    });
  }
};

export const softDeleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    await Interview.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({ message: "Interview moved to trash" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting interview" });
  }
};

export const getWorkspaceInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .select("role experience finalScore createdAt resumeId");
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching workspace" });
  }
};

export const getImprovementData = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    // جلب كل المقابلات المكتملة المرتبطة بهذا الـ CV فقط
    const interviews = await Interview.find({
      userId: req.userId,
      resumeId: resumeId,
      status: "completed",
      isDeleted: false,
    })
      .sort({ createdAt: 1 }) // الترتيب من الأقدم للأحدث
      .select("finalScore createdAt");

    // تنسيق البيانات لتناسب الرسم البياني
    const chartData = interviews.map((item, index) => ({
      name: `Session ${index + 1}`,
      score: Number(item.finalScore.toFixed(1)),
      date: new Date(item.createdAt).toLocaleDateString(),
    }));

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress data" });
  }
};

export const generateSpeech = async (req, res) => {
  try {
    const { text, gender } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    // تهيئة المحرك مع User-Agent متوافق مع تحديثات مايكروسوفت 2025/2026
    const tts = new MsEdgeTTS();
    const voice =
      gender === "female" ? "ar-EG-SalmaNeural" : "ar-EG-ShakirNeural";

    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // استخدام الـ Stream للحصول على البيانات الصوتية (هذا هو الحل الجذري للـ 500)
    const { audioStream } = tts.toStream(text);
    const chunks = [];

    // تجميع البيانات الصادرة من WebSocket مايكروسوفت
    await new Promise((resolve, reject) => {
      audioStream.on("data", (chunk) => chunks.push(chunk));
      audioStream.on("end", () => resolve());
      audioStream.on("error", (err) => reject(err));
    });

    const audioBuffer = Buffer.concat(chunks);

    if (audioBuffer.length === 0) throw new Error("فشل في استلام بيانات الصوت");

    res.json({ audioContent: audioBuffer.toString("base64") });
  } catch (error) {
    console.error("Critical TTS Error:", error);
    res
      .status(500)
      .json({ message: "Speech synthesis failed", detail: error.message });
  }
};