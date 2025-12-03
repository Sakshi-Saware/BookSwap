// src/pages/Signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Create your account</h2>
        <p className="text-sm text-gray-600 mb-6">Choose account type to get started</p>

        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => nav("/signup-user")}
            className="px-6 py-3 bg-[var(--btn)] text-white rounded-lg">I'm a Reader</button>
          <button onClick={() => nav("/signup-cafe")}
            className="px-6 py-3 border rounded-lg">I'm a Café</button>
        </div>

        <div className="text-sm text-gray-500">
          Already have an account? <button onClick={() => nav("/login")} className="text-[var(--btn)]">Log in</button>
        </div>
      </div>
    </div>
  );
}
