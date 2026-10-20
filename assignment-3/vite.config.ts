import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// This file configures Vite, our frontend development server and build tool
// Please do NOT modify this file as it has been configured for this assignment
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // fetch("/api/papers") is forwarded to the Assignment 2 backend
    proxy: { "/api": "http://localhost:3000" },
  },
});
