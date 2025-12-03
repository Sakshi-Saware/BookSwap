// src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";



function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AppRoutes />
    </div>
  );
}

export default App;
