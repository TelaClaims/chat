import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "./index.css";
import ChatProvider from "@/package/context/Chat/ChatProvider.tsx";

ReactDOM.render(
  <React.StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
