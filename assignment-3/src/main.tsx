import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles/global.css";
// TODO: Import Routes, Route, Home, and EditPaper
import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import EditPaper from "./routes/EditPaper";

// Inside BrowserRouter, define / -> Home and /edit/:id -> EditPaper.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* TODO: Set up the two assignment routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<EditPaper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);