import React, { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export const Result = ({ speed, accuracy, errors, correct, handleClick }) => {
  const total = correct + errors;
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  useEffect(() => {
    const animateValue = (setter, finalValue, duration = 1000) => {
      let start = 0;
      const increment = finalValue / (duration / 20); // Adjust speed
      const interval = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
          setter(finalValue);
          clearInterval(interval);
        } else {
          setter(Math.floor(start));
        }
      }, 20); // 20ms update interval
    };
    animateValue(setAnimatedSpeed, speed);
  },[speed]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="relative bg-backgroundcolor2 border border-gray-700 rounded-xl p-8 w-[450px] shadow-lg text-textcolor">
        {/* Title */}
        <h2 className="text-center text-2xl font-semibold tracking-wide mb-6">
          Typing Test Results
        </h2>

        {/* Speed Section */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-primary">{animatedSpeed}</span>
          <span className="text-lg ">Words Per Minute</span>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-600"></div>

        {/* Accuracy & Stats */}
        <div className="flex justify-around">
          {/* Accuracy Box */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium ">Accuracy</span>
            <span className="text-3xl font-bold ">{accuracy}%</span>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] bg-gray-600"></div>

          {/* Stats Box */}
          <div className="text-lg space-y-1 text-center">
            <p>
              <span className="">Total: </span>
              <span className="font-medium">{total}</span>
            </p>
            <p>
              <span className="">Correct: </span>
              <span className="font-medium">{correct}</span>
            </p>
            <p>
              <span className="">Mistakes: </span>
              <span className="font-medium">{errors}</span>
            </p>
          </div>
        </div>

        {/* Play Again Button */}
        <div className="w-full flex items-center justify-center">
          <button
            onClick={handleClick}
            className="realtive group mt-6 w-[110px] flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-textcolor text-lg font-medium transition-all duration-300 hover:bg-primary/90 active:scale-95"
          >
            <RotateCcw
              size={20}
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
            <span className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-200">
              Text Again
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
