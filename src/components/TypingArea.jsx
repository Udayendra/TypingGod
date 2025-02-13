import React, { useState } from "react";

const TypingPractice = () => {
  const [text] = useState("The quick brown fox jumps over the lazy dog."); // Target text
  const [typedText, setTypedText] = useState(""); // User's typed text
  const [charIndex, setCharIndex] = useState(0); // Current character index

  // Split the text into words
  const words = text.split(" ");

  // Get the index of the current word
  const getCurrentWordIndex = () => {
    let charCount = 0;

    for (let i = 0; i < words.length; i++) {
      charCount += words[i].length + 1; // Add 1 for the space after each word
      if (charIndex < charCount) {
        return i; // Return the current word index
      }
    }

    return words.length - 1; // Return the last word index if charIndex exceeds
  };

  const currentWordIndex = getCurrentWordIndex(); // Compute the current word index
  const currentWord = words[currentWordIndex]; // Get the current word

  // Calculate the start index of the current word
  const currentWordStartIndex = words
    .slice(0, currentWordIndex)
    .reduce((acc, word) => acc + word.length + 1, 0); // Sum up lengths of preceding words and spaces

  // Relative index within the current word
  const relativeIndex = charIndex - currentWordStartIndex;

  const handleKeyDown = (e) => {
    const { key } = e;

    if (key === "Backspace") {
      // Handle Backspace
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
        setTypedText((prev) => prev.slice(0, -1));
      }
    } else if (key.length === 1) {
      // Handle Character Typing
      setTypedText((prev) => prev + key);
      setCharIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className="flex flex-col items-center p-4 space-y-4"
      tabIndex={0} // Make div focusable
      onKeyDown={handleKeyDown}
    >
      {/* Target Text Display */}
      <div className="w-full max-w-2xl bg-gray-100 p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold mb-2">Text to type:</p>
        <div className="space-x-2 flex flex-wrap">
          {text.split("").map((char, index) => {
            const isCorrect = index < charIndex && char === typedText[index];
            const isIncorrect = index < charIndex && char !== typedText[index];
            const isCurrentChar = index === charIndex;

            return (
              <span
                key={index}
                className={`text-xl px-1 ${
                  isCurrentChar
                    ? "bg-blue-300 text-white"
                    : isCorrect
                    ? "text-green-500"
                    : isIncorrect
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                {char === " " ? "\u00A0" : char} {/* Display spaces */}
              </span>
            );
          })}
        </div>
      </div>

      {/* Typing Area */}
      <div className="relative bg-white border border-gray-400 rounded-lg p-4 h-16 w-full max-w-2xl flex items-center justify-center">
        {currentWord.split("").map((char, index) => {
          const isCorrect =
            index < relativeIndex && char === currentWord[relativeIndex - 1];
          const isIncorrect =
            index < relativeIndex && char !== currentWord[relativeIndex - 1];
          const isCursor = index === relativeIndex;
          return (
            <span
              key={index}
              className={`relative text-xl ${
                index < relativeIndex ? "text-black" : "text-gray-400"
              } ${isCursor ? "border-l-2 border-blue-500 animate-blink" : ""}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Restart Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            setTypedText("");
            setCharIndex(0);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingPractice;
