import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTypingGod } from "../hooks/TypingGodContext";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTypingGod();
  return (
    <button
      onClick={toggleDarkMode}
      className="border-2 border-textcolor/50 p-2 w-10 h-10 rounded-full dark:border-textcolor/50 relative overflow-hidden"
    >
      <div
        className={`absolute -top-[2px] -left-[2px] flex flex-col items-center justify-center transition-all duration-300 ${
          isDarkMode
            ? "animate-sunset rotate-180  dark:text-textcolor"
            : "animate-sunrise "
        } `}
      >
        <div className={`p-2  `}>
          <Moon />
        </div>

        <div className={`p-2  `}>
          <Sun />
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;
