import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootEl = document.getElementById("root");

if (rootEl === null) {
  throw new Error("Could not find element to mount into, looking for #root");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
