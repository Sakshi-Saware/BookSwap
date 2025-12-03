// src/pages/Community.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";

import { cafeEventsAPI } from "../services/mockCafeServices";

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  function loadEvents() {
    let list = cafeEventsAPI.getAllEvents() || [];

    // SAFE defaults to avoid blank screen
    list = list.map(ev => ({
      ...ev,
      attendees: ev.attendees || [],
      comments: ev.comments || [],
      reviews: ev.reviews || [],
      host: ev.host || "Unknown Café",
      location: ev.location || "Not specified",
      banner: ev.banner || "/default-banner.png",
    }));

    setEvents(list);
  }

  function toggleExpand(id) {
    setExpanded(expanded === id ? null : id);
  }

  function handleRSVP(ev) {
    if (!user) return alert("Please log in first");

    const updated = [
      ...ev.attendees,
      { id: user.uid, name: user.displayName || "User" }
    ];

    cafeEventsAPI.updateEvent(ev.id, { attendees: updated });
    loadEvents();
  }

  function addComment(ev) {
    if (!user) return alert("Please log in first");
    if (!ev.newComment?.trim()) return;

    const updatedComments = [
      ...ev.comments,
      {
        id: Date.now(),
        userName: user.displayName || "User",
        text: ev.newComment,
      },
    ];

    cafeEventsAPI.updateEvent(ev.id, { comments: updatedComments });
    loadEvents();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold mb-2">📅 Community Events</h1>
        <p className="text-gray-600 text-lg">Discover book meetups & café events</p>
      </motion.div>

      {/* EVENT CARDS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onRSVP={() => handleRSVP(ev)}
            onViewDetails={() => navigate(`/event/${ev.id}`)}
          />
        ))}
      </div>

    </div>
  );
}
