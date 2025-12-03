// src/components/PasswordInput.jsx
import React, { useState } from "react";

export default function PasswordInput({ value, onChange, name="password", placeholder="Password", id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border p-2 rounded"
      />
      <button type="button" onClick={() => setShow(s => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
