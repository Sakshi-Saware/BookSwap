// src/components/CafeHeader.jsx
import { useCafeAuth } from "../context/CafeAuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function CafeHeader() {
  const { cafe, logout } = useCafeAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    nav("/login");
  }

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50 rounded-b-xl">

      {/* LEFT — Website Name */}
      <div
        className="text-3xl font-bold cursor-pointer text-gray-900 tracking-tight"
        onClick={() => nav("/cafe/dashboard")}
      >
        BookSwap
      </div>

      {/* RIGHT — Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 bg-[#f4efea] px-4 py-2 rounded-xl hover:bg-[#ece7e1] transition cursor-pointer shadow-sm"
        >
          {/* Profile Image */}
          <img
            src={cafe?.logo || "/default-cafe.png"}
            className="w-10 h-10 rounded-full object-cover border"
          />

          {/* Café Info */}
          <div className="text-left leading-tight">
            <p className="font-semibold text-gray-800">{cafe?.name}</p>
            <p className="text-xs text-gray-500">{cafe?.ownerName}</p>
          </div>

          {/* Dropdown Arrow */}
          <svg
            className={`w-4 h-4 text-gray-700 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100">
            <button
              onClick={() => {
                setOpen(false);
                nav("/cafe/profile/edit");
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 font-medium"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
