import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import { CafeAuthProvider } from "./context/CafeAuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CafeAuthProvider>
        <App />
      </CafeAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
