import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {TypingGodProvider} from "./hooks/TypingGodContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TypingGodProvider>
      <App />
    </TypingGodProvider>
  </StrictMode>
);
