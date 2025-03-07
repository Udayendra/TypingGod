import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RotateCcw } from "lucide-react";
import texts from "./texts";
import { useTypingGod } from "../hooks/TypingGodContext";
import { Result } from "./Result";

const TypingPractice = () => {
  const {
    timeLeft,
    startTimer,
    resetTimer,
    isRunning,
    setIsRunning,
    setTimeLeft,
  } = useTypingGod();

  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const [selectedTime, setSelectedTime] = useState(60);
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [result, setResult] = useState(false);

  const handleTimeSelect = (time) => {
    if (!isRunning) {
      setSelectedTime(time);
      resetTimer();
      setTimeLeft(time);
    }
  };

  const formateTime = (time) => {
    if (time === 0) return "Time's Up!";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRandomText = (prevText = "") => {
    if (texts.length === 0) return "No text available.";
    let newText;
    do {
      const randomIndex = Math.floor(Math.random() * texts.length);
      newText = texts[randomIndex];
    } while (newText === prevText);
    return newText;
  };

  const [text, setText] = useState("");

  const textSpanRef = useMemo(() => {
    return Array(text.split(" ").length)
      .fill(0)
      .map(() => React.createRef());
  }, [text]);

  useEffect(() => {
    setText(getRandomText());
    focusInput();
  }, []);

  const handleRandomTextChange = () => {
    setText(getRandomText(text));
  };

  useEffect(() => {
    if (text.length === 1 && !isRunning) {
      setIsRunning(true);
      startTimer(selectedTime);
    }
  }, [text, isRunning, startTimer, selectedTime]);

  const restartHandle = () => {
    focusInput();
    handleRandomTextChange();
    resetTimer(selectedTime);
    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setCorrectChars(0);
    setAccuracy(0);
    setErrors(0);
    setSpeed(0);
    setResult(false);
    handleTimeSelect(selectedTime);
    textSpanRef.forEach((wordRef) => {
      if (wordRef.current) {
        wordRef.current.childNodes.forEach((charRef) => {
          charRef.className = "text-textcolor/50 px-[2px] py-1";
        });
      }
    });
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = 0;
    }
  };

  const isFinished = timeLeft === 0;

  useEffect(() => {
    if (textSpanRef[0].current) {
      textSpanRef[0].current.classList.add("blinker");
    }
  }, [text]);

  const focusInput = useCallback(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const minutes = (selectedTime - timeLeft) / 60;
    const totalChars = correctChars + errors;
    setSpeed(minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0);
    setAccuracy(
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0
    );
  }, [correctChars, timeLeft]);


  useEffect(() => {
    if (result) {
      setIsRunning(false);
    }
  }, [result]);

  useEffect(() => {
    const container = textContainerRef.current; // Your text container
    const blinker = document.querySelector(".blinker"); // The active cursor
  
    if (container && blinker) {
      const { offsetTop, offsetHeight } = blinker;
      // Check if cursor is near the bottom of the visible container
      if (offsetTop + offsetHeight > container.scrollTop + container.clientHeight - 10) {
        container.scrollBy({
          // top: offsetTop - container.clientHeight + 100, // Scroll smoothly
          top: offsetHeight + 10, // Scroll smoothly
          behavior: "smooth",
        });
      }
    }
  }, [currCharIndex]); // Runs whenever the cursor moves
  

  // userinput handle
  const handleUserInput = (e) => {
    if (isFinished) {
      return;
    }
    if (
      currWordIndex === textSpanRef.length - 1 &&
      currCharIndex === textSpanRef[currWordIndex].current.childNodes.length - 1
    ) {
      if (!result) {
        setResult(true);
        setIsRunning(false);
      }
      return;
    }
    const allCurrChar = textSpanRef[currWordIndex].current.childNodes;
    const char = allCurrChar[currCharIndex].innerText;
    const inputChar = e.key;

    if (inputChar === "Backspace") {
      if (currCharIndex > 0) {
        allCurrChar[currCharIndex].classList.remove("blinker");
        allCurrChar[currCharIndex - 1].classList.add("blinker");
        allCurrChar[currCharIndex - 1].classList.add("text-textcolor/50");

        const prevCharElement = allCurrChar[currCharIndex - 1];

        if (prevCharElement.classList.contains("text-textcolor")) {
          setCorrectChars((prev) => Math.max(prev - 1, 0)); // If it was correct, decrement correctChars
        } else if (prevCharElement.classList.contains("text-redcolor")) {
          setErrors((prev) => Math.max(prev - 1, 0)); // If it was incorrect, decrement errors
        }

        setCurrCharIndex((prevIndex) => prevIndex - 1);
      } else if (currWordIndex > 0) {
        const lastChar =
          textSpanRef[currWordIndex - 1]?.current.childNodes.length - 1;

        allCurrChar[currCharIndex].classList.remove("blinker");
        if (textSpanRef[currWordIndex - 1]?.current?.childNodes[lastChar]) {
          textSpanRef[currWordIndex - 1].current.childNodes[
            lastChar
          ].classList.add("blinker");
          textSpanRef[currWordIndex - 1].current.childNodes[
            lastChar
          ].classList.remove("wrongSpace");
        }
        setCurrWordIndex(currWordIndex - 1);
        setCurrCharIndex(lastChar);
      }
      return;
    }

    const isValidChar =
      /^[a-zA-Z0-9!@#$%^&*()_+=\[\]{};:'"<>?/\\|`~.,-\s]$/.test(inputChar);

    if (!isValidChar) {
      return;
    }

    if (!isRunning) {
      startTimer(selectedTime); //start timer
    }

    if (allCurrChar.length - 1 === currCharIndex) {
      if (e.keyCode === 32) {
        if (textSpanRef[currWordIndex]?.current) {
          textSpanRef[currWordIndex].current.childNodes[
            currCharIndex
          ].classList.remove("blinker");
        }
        if (textSpanRef[currWordIndex + 1]?.current?.childNodes[0]) {
          textSpanRef[currWordIndex + 1].current.childNodes[0].classList.add(
            "blinker"
          );
        }
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(0);
        return;
      } else {
        textSpanRef[currWordIndex].current.childNodes[
          currCharIndex
        ].classList.add("wrongSpace");
        if (textSpanRef[currWordIndex]?.current) {
          textSpanRef[currWordIndex].current.childNodes[
            currCharIndex
          ].classList.remove("blinker");
        }
        if (textSpanRef[currWordIndex + 1]?.current?.childNodes[0]) {
          textSpanRef[currWordIndex + 1].current.childNodes[0].classList.add(
            "blinker"
          );
        }
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(0);
        return;
      }
    } else {
      if (e.keyCode === 32) {
        return;
      }
    }

    if (e.shiftKey) {
      if (char == inputChar.toUpperCase()) {
        setCorrectChars((prev) => prev + 1);
        allCurrChar[currCharIndex].className = "text-textcolor px-[2px] py-1";
      } else {
        setErrors((prev) => prev + 1);
        allCurrChar[currCharIndex].className = "text-redcolor py-1 px-[2px]";
      }
    } else {
      if (char == inputChar.toLowerCase()) {
        setCorrectChars((prev) => prev + 1);
        allCurrChar[currCharIndex].className = "text-textcolor px-[2px] py-1";
      } else {
        setErrors((prev) => prev + 1);
        allCurrChar[currCharIndex].className = "text-redcolor py-1 px-[2px]";
      }
    }

    if (textSpanRef[0].current) {
      textSpanRef[0].current.classList.remove("blinker");
    }
    if (allCurrChar[currCharIndex + 1]) {
      allCurrChar[currCharIndex + 1].classList.add("blinker");
    }

    setCurrCharIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="container h-[70vh] flex flex-col items-center text-textcolor/50 dark:text-textcolor/50">
      {/* {!isFinished && ( */}
      <div className={`w-full mt-5 py-5`}>
        <div className="flex justify-between mx-auto pb-5 w-full">
          <div className="text-[2rem] font-inter text-textcolor">
            {formateTime(timeLeft)}
            {/* <span className="text-[1.125rem]">s</span>{" "} */}
          </div>
          <div className="flex space-x-3 items-center justify-center">
            <div className="flex space-x-2 px-2 border border-textcolor/20 rounded relative">
              {[60, 120, 300].map((time) => {
                return (
                  <div
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`px-2 py-1 text-[1.125rem] cursor-pointer font-inter ${
                      selectedTime === time
                        ? "text-textcolor"
                        : "text-textcolor/50"
                    }  ${isRunning ? "" : "hover:text-textcolor"}`}
                    disabled={isRunning}
                  >
                    {time / 60}
                    <span className="text-[1rem]">m</span>
                  </div>
                );
              })}
              <span className="absolute bg-textcolor/20 w-[3px] h-5 rounded-full top-[7px] left-[42px]"></span>
              <span className="absolute bg-textcolor/20 w-[3px] h-5 rounded-full top-[7px] right-[50px]"></span>
            </div>
            <div
              onClick={restartHandle}
              className=" relative flex items-center justify-center  cursor-pointer group pl-2"
            >
              <RotateCcw />
              <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Restart
                <span className="absolute -bottom-1 left-[45%] rotate-45 h-2 w-2 bg-gray-500"></span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            ref={textContainerRef}
            className="text-[1.5rem] font-roboto scrollbar-hide max-h-[200px] overflow-y-auto p-4"
            onClick={focusInput}
          >
            {text.split(" ").map((word, index) => (
              <span
                key={index}
                className=" inline-block"
                ref={textSpanRef[index]}
              >
                {word.split("").map((char, charindex) => {
                  return (
                    <span
                      key={charindex}
                      className={`inline-block px-[2px] py-1 `}
                    >
                      {char}
                    </span>
                  );
                })}
                <span className="px-1">&nbsp;</span>
              </span>
            ))}
          </div>
          <input
            type="text"
            onKeyDown={handleUserInput}
            className="absolute opacity-0 h-0 w-0"
            ref={inputRef}
          />
        </div>
      </div>
      {/* )} */}
      <div className="flex items-center justify-center h-screen w-full">
        <div className="border w-full mt-5 p-5 rounded-lg">
          <div className="grid grid-cols-3 items-center justify-center">
            <div className="flex flex-col items-center justify-center text-[1.125rem] font-inter text-textcolor/50 dark:text-textcolor/50">
              <div className="text-textcolor">Speed</div>{" "}
              <div className="text-textcolor">{speed} WPM</div>
            </div>
            <div className="flex flex-col items-center justify-center border-x-2 border-graycolor dark:border-graycolor/30 text-[1.125rem] font-inter text-textcolor/50 dark:text-textcolor/50">
              <div className="text-textcolor">Accuracy</div>{" "}
              <div className="text-textcolor">{accuracy}%</div>
            </div>
            <div className="flex flex-col items-center justify-center text-[1.125rem] font-inter text-textcolor/50 dark:text-textcolor/50">
              <div className="text-textcolor">Errors</div>{" "}
              <div className="text-textcolor">{errors}</div>
            </div>
          </div>
        </div>
      </div>
      {(isFinished || result) && (
        <Result
          speed={speed}
          accuracy={accuracy}
          errors={errors}
          correct={correctChars}
          incorrect={errors}
          handleClick={restartHandle}
        />
      )}
    </div>
  );
};

export default TypingPractice;
