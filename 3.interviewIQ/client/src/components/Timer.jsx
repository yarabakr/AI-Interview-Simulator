import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer({ timeLeft, totalTime }) {
  // حساب النسبة المئوية بشكل صحيح للـ progress bar
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="w-20 h-20 mx-auto">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "28px",
          // تم تغيير الأخضر إلى الموف البراند تبعك
          pathColor: "#8935b0",
          // خليت اللون الأحمر للوقت لأنه بيعطي تنبيه (Alert) وهو الأنسب للتايمر
          textColor: "#ef4444",
          trailColor: "#e5e7eb",
          pathTransitionDuration: 0.5,
        })}
      />
    </div>
  );
}

export default Timer;