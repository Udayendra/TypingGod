import { createContext, useContext, useEffect, useState } from "react";

const TypingGodContext = createContext();

export const TypingGodProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
  });

  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = (Duration = 60) => {
    setTimeLeft(Duration);
    setIsRunning(true);
  };

  const resetTimer = (time) => {
    setTimeLeft(time);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return; // Stop if timer is not running or reached 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkModeQuery.addEventListener("change", handleChange);

    if (darkModeQuery.matches) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    timeLeft,
    startTimer,
    resetTimer,
    isRunning,
    setTimeLeft,
    setIsRunning,
  };

  return (
    <TypingGodContext.Provider value={value}>
      {children}
    </TypingGodContext.Provider>
  );
};

export const useTypingGod = () => useContext(TypingGodContext);
