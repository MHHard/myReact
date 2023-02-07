import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
console.log("process.env", process.env);
if (root) {
  createRoot(root).render(<App />);
}
