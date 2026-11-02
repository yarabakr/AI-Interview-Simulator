# 🤖 AI Interview Simulator

> A web-based intelligent interview platform designed to help job seekers prepare for professional interviews through intelligent simulation and real-time AI-powered feedback.

---

## 📸 Demo & Screenshots

| Interview Setup Page | Active Interview Session |
| :---: | :---: |
| ![Interview Setup](
<img width="1858" height="910" alt="Screenshot 2026-05-30 151558" src="https://github.com/user-attachments/assets/3f68d315-8e0e-442c-9de4-1372bf6edc4d" />

) | 

![Active Interview]
<img width="1894" height="891" alt="Screenshot 2026-05-19 184410" src="https://github.com/user-attachments/assets/4be5655f-79ba-45c1-932e-39982fcf53ab" />

) |

| Performance Report Dashboard | Interview History Workspaces |
| :---: | :---: |
| ![Performance Report] 

<img width="1919" height="932" alt="Screenshot 2026-05-19 184448" src="https://github.com/user-attachments/assets/c9cd76a3-d714-4092-8400-f412edab47b7" />
<img width="1878" height="939" alt="Screenshot 2026-05-19 184458" src="https://github.com/user-attachments/assets/f0052806-337d-403c-a460-8742f5a96b68" />

| ![Interview History]() |
![Uploading Screenshot 2026-05-19 184419.png…]()
<img width="1907" height="903" alt="Screenshot 2026-05-19 184428" src="https://github.com/user-attachments/assets/7aa87d11-aed3-4313-88b0-3b3a88ffcbf6" />

---

## ✨ Key Features

* **Personalized Question Generation:** Dynamically generates unique interview questions using `GPT-4o-mini` via OpenRouter API, tailored to the candidate's target role, experience level, and uploaded resume content[cite: 1].
* **Smart Voice Interview:** Combines the browser's Web Speech Recognition API for capturing spoken responses with Text-to-Speech (TTS) technology (using `msedge-tts` for Arabic and browser synthesis for English) to deliver questions naturally through AI avatars[cite: 1].
* **Real-time Facial Emotion Analysis:** Utilizes browser-based `face-api.js` (TinyFaceDetector and FaceExpressionNet) to monitor emotional states and non-verbal cues throughout the interview[cite: 1].
* **Comprehensive Performance Reports:** Evaluates answers across confidence, communication, and correctness dimensions, presenting insights through interactive Recharts and downloadable PDF reports (using `jsPDF`)[cite: 1].
* **Bilingual Support:** Seamlessly supports full interview workflows in both English and Arabic with automatic RTL layout formatting[cite: 1].
* **Credit-Based Access System:** Manages user access and interview allowances with an automated 12-hour credit refresh cycle[cite: 1].

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Framer Motion, Recharts, `face-api.js`[cite: 1].
* **Backend:** Node.js, Express.js, Socket.IO[cite: 1].
* **Database:** MongoDB with Mongoose ODM[cite: 1].
* **AI & External Services:** OpenRouter API (`GPT-4o-mini`), Microsoft Edge TTS (`msedge-tts`), Firebase Authentication (Google OAuth), Multer & pdfjs-dist for PDF parsing[cite: 1].

---


