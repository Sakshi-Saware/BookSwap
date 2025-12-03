// src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { cafeEventsAPI } from "../services/mockCafeServices";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function EventDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    loadEvent();
  }, [id]);

  function loadEvent() {
    let ev = cafeEventsAPI.getEvent(id);

    if (ev) {
      ev.banner = ev.banner || "/default-banner.webp";
      ev.attendees = ev.attendees || [];
      ev.comments = ev.comments || [];
      ev.host = ev.host || "Unknown Café";
      ev.location = ev.location || "Not specified";
      ev.mapsLink =
        ev.mapsLink ||
        "https://www.google.com/maps?q=" + encodeURIComponent(ev.location);
    }

    setEvent(ev);
    setLoading(false);
  }

  function handleRSVP() {
    if (!user) return alert("Please login first!");

    // 🔥 CHECK IF USER ALREADY RSVP'd
    const alreadyJoined = event.attendees.some(a => a.id === user.uid);

    if (alreadyJoined) {
      return alert("You have already joined this event!");
    }

    const updated = [
      ...event.attendees,
      { id: user.uid, name: user.name || "User" },
    ];

    cafeEventsAPI.updateEvent(event.id, { attendees: updated });
    loadEvent();
  }


  function addComment() {
    if (!user) return alert("Please login first!");
    if (!commentText.trim()) return;

    const updatedComments = [
      ...event.comments,
      {
        id: Date.now(),
        userName: user.name || "User",
        text: commentText.trim(),
      },
    ];

    cafeEventsAPI.updateEvent(event.id, { comments: updatedComments });

    setCommentText("");
    loadEvent();
  }

  if (loading) return <div className="p-6 text-center">Loading event...</div>;

  if (!event)
    return (
      <div className="p-6 text-center text-red-600 text-xl">
        Event not found!
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* ============================= */}
      {/* HERO BANNER */}
      {/* ============================= */}
      <motion.div
        className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src={event.banner}
          className="w-full h-full object-cover"
          alt={event.title}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Title Over Banner */}
        <div className="absolute left-6 bottom-6 text-white">
          <h1 className="text-4xl font-bold drop-shadow-lg">{event.title}</h1>
          <p className="text-gray-200">{event.host}</p>
        </div>
      </motion.div>

      {/* ============================= */}
      {/* EVENT INFO CARD */}
      {/* ============================= */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow border space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Event Information
        </h2>

        <p className="text-gray-700 text-lg leading-relaxed">
          {event.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-gray-700 text-base mt-4">
          <p><strong>📅 Date:</strong> {event.date}</p>
          <p><strong>⏰ Time:</strong> {event.time}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
          <p>
            <strong>🎤 Hosted by:</strong> {event.host || "Your Café"}
          </p>

        </div>

        {/* RSVP BUTTON */}
        <button
          onClick={handleRSVP}
          className="mt-3 px-6 py-3 bg-[var(--btn)] text-white rounded-xl text-lg font-semibold shadow hover:opacity-90 transition"
        >
          RSVP Now
        </button>
      </motion.div>

      {/* ============================= */}
      {/* MAP CARD */}
      {/* ============================= */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow border space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gray-800">📍 Location Map</h2>

        <iframe
          src={event.mapsLink}
          className="w-full h-64 rounded-xl border"
          loading="lazy"
        ></iframe>
      </motion.div>

      {/* ============================= */}
      {/* ATTENDEES */}
      {/* ============================= */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow border space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gray-800">👥 Attendees</h2>

        {event.attendees.length === 0 ? (
          <p className="text-gray-500">No attendees yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {event.attendees.map((a) => (
              <span
                key={a.id}
                className="px-3 py-1 bg-gray-100 rounded-full border text-sm shadow-sm"
              >
                {a.name}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ============================= */}
      {/* COMMENTS */}
      {/* ============================= */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow border space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gray-800">💬 Comments</h2>

        {/* Existing Comments */}
        <div className="space-y-4 mb-3">
          {event.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            event.comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 p-4 rounded-xl border shadow-sm"
              >
                <p className="font-semibold">{c.userName}</p>
                <p className="text-gray-600">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Add a comment */}
        {user && (
          <>
            <textarea
              className="w-full p-3 border rounded-xl"
              rows="3"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>

            <button
              onClick={addComment}
              className="mt-3 px-4 py-2 bg-[var(--btn)] text-white rounded-lg shadow hover:opacity-90 transition"
            >
              Post Comment
            </button>
          </>
        )}
      </motion.div>

      {/* BACK BUTTON */}
      <button
        onClick={() => nav("/community")}
        className="text-blue-600 hover:underline font-medium"
      >
        ← Back to Community
      </button>
    </div>
  );
}
