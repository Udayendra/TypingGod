import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import MobileNotification from "./components/MobileNotification";
import TypingPractice from "./components/TypingPractice";

function App() {
  return (
    <div className="relative bg-background dark:bg-backgroundcolor2 transition-all duration-300 h-screen">
      <MobileNotification />
      <NavBar />
      <div className="">
        {" "}
        <TypingPractice />
      </div>
    </div>
  );
}

export default App;
