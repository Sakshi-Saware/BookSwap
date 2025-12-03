// src/components/EventCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function EventCard({
  event,
  onRSVP,
  onViewDetails,
  compact = true,
}) {
  // SAFE DEFAULTS
  const attendees = event.attendees || [];
  const comments = event.comments || [];
  const location = event.location || "Not specified";
  const host = event.host || "Unknown Café";
  const banner = event.banner || "/default-banner.png";

  return (
    <motion.div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition
        border
        overflow-hidden
        cursor-pointer
        flex
        flex-col
      "
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      onClick={() => onViewDetails(event)}
    >

      {/* ======================== */}
      {/* BANNER IMAGE */}
      {/* ======================== */}
      <div className={`${compact ? "h-44" : "h-56"} w-full`}>
        <img
          src={banner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ======================== */}
      {/* CONTENT */}
      {/* ======================== */}
      <div className="p-4 flex flex-col gap-3">

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
          {event.title}
        </h2>

        {/* Hosted By */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span className="text-gray-400">🎤</span> {host}
        </p>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Event Info */}
        <div className="text-xs text-gray-500 space-y-1 pt-1">
          <p className="flex items-center gap-1"><span>📍</span> {location}</p>
          <p className="flex items-center gap-1"><span>📅</span> {event.date}</p>
          <p className="flex items-center gap-1"><span>⏰</span> {event.time}</p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-1"></div>

        {/* Attendees + Comments */}
        <div className="flex items-center justify-between text-xs text-gray-700">
          <span className="flex items-center gap-1">
            👥 <span className="font-medium">{attendees.length}</span> Attending
          </span>
          <span className="flex items-center gap-1">
            💬 <span className="font-medium">{comments.length}</span>
          </span>
        </div>

        {/* RSVP Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRSVP(event);
          }}
          className="
            w-full 
            py-2.5  
            text-white 
            rounded-xl 
            font-semibold
            shadow-sm
            bg-[var(--btn)]
            hover:opacity-90
            transition
            active:scale-95
          "
        >
          RSVP
        </button>

      </div>
    </motion.div>
  );
}
