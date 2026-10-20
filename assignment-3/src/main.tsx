import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles/global.css";
// TODO: Import Routes, Route, Home, and EditPaper

// Inside BrowserRouter, define / -> Home and /edit/:id -> EditPaper.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* TODO: Set up the two assignment routes */}
    </BrowserRouter>
  </StrictMode>,
);
