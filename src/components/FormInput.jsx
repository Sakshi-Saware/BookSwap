// src/components/FormInput.jsx
import React from "react";

export default function FormInput({ label, id, children, hint, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>}
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
