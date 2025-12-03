// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mock } from "../services/mockService";
import { cafeEventsAPI } from "../services/mockCafeServices";
import BookCard from "../components/BookCard";
import RequestModal from "../components/RequestModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showReq, setShowReq] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    load();
    loadEvents();
  }, []);

  async function load() {
    const list = await mock.listBooks();
    setBooks(list);
  }

  function loadEvents() {
    const ev = cafeEventsAPI.getAllEvents() || [];
    setEvents(ev.reverse()); // newest first
  }

  function onRequest(book) {
    setSelected(book);
    setShowReq(true);
  }

  async function onWish(book) {
    if (!user) return alert("Login required");
    await mock.addToWishlist(user.uid, book.id);
    alert("Added to wishlist");
  }

  return (
    <div className="min-h-screen text-[var(--text)]">

      {/* ================================
         🌟 HERO SECTION
      ================================== */}
      <section className="relative px-6 py-16 md:py-24 bg-gradient-to-r from-[#FFF8EC] to-[#F7F7F7] flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <motion.div
          className="w-full md:w-1/2 space-y-6 z-10"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            BookSwap – Exchange. Read. Repeat. 📚
          </h1>

          <p className="text-gray-600 text-lg max-w-lg">
            Swap books with readers near you and discover your next favorite read — easy, fast, eco-friendly.
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-[var(--btn)] text-white rounded-lg shadow hover:opacity-90"
            >
              Browse Books
            </button>

            {!user && (
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 border border-[var(--btn)] text-[var(--btn)] rounded-lg hover:bg-[var(--btn)] hover:text-white transition"
              >
                Join Now
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block md:w-1/2"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <img src="/images/hero_books.svg" className="w-full max-w-lg mx-auto drop-shadow-xl" />
        </motion.div>

        <motion.div
          className="absolute right-0 top-0 w-72 h-72 bg-[var(--btn)] opacity-10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
      </section>

      {/* ================================
         ✨ FEATURES
      ================================== */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Why BookSwap?</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { icon: "📖", title: "Huge Library", text: "Browse books by every genre imaginable." },
            { icon: "🔁", title: "Easy Swap System", text: "Borrow or exchange books without hassle." },
            { icon: "💬", title: "In-App Chat", text: "Talk directly to book owners safely." },
            { icon: "🔍", title: "Smart Search", text: "Find exactly what you're looking for." },
            { icon: "🌱", title: "Eco-Friendly", text: "Reuse books and reduce waste." },
            { icon: "📂", title: "Track Everything", text: "Requests, swaps, wishlist — all in one place." },
          ].map((f) => (
            <motion.div
              key={f.title}
              className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="font-bold text-lg mt-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================================
        🧑‍🤝‍🧑 COMMUNITY GATHERINGS (DYNAMIC FROM CAFÉ EVENTS)
      ================================== */}
      <section className="px-6 py-16 bg-gray-50 rounded-3xl mt-12">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
          📅 Community Happenings
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Meet fellow readers, exchange books, and build real connections.
        </p>

        {/* Featured Events (First 4) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {events.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              onClick={() => navigate(`/event/${ev.id}`)}
              className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={ev.banner || "/default-banner.webp"}
                className="w-full h-32 object-cover rounded-md"
              />

              <h3 className="mt-3 text-lg font-semibold line-clamp-1">{ev.title}</h3>

              <p className="text-sm text-gray-600">📅 {ev.date}</p>
              <p className="text-sm text-gray-600">⏰ {ev.time}</p>
              <p className="text-sm text-gray-600">📍 {ev.location}</p>

              <span className="inline-block text-xs px-2 py-1 bg-[var(--btn)] text-white rounded-md mt-2">
                {ev.attendees?.length || 0} Joined
              </span>
            </div>
          ))}
        </div>

        {/* SHOW MORE / LESS EVENTS */}
        <div className="text-center">
          {!showMoreEvents && events.length > 4 ? (
            <button
              onClick={() => setShowMoreEvents(true)}
              className="px-6 py-2 text-[var(--btn)] bg-white border border-[var(--btn)] rounded-lg hover:bg-[var(--btn)] hover:text-white transition"
            >
              Show More Events ↓
            </button>
          ) : (
            showMoreEvents && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {events.slice(4).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => navigate(`/event/${ev.id}`)}
                      className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold">{ev.title}</h3>
                      <p className="text-sm text-gray-600">{ev.date}</p>
                      <p className="text-sm text-gray-600">📍 {ev.location}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowMoreEvents(false)}
                  className="mt-6 px-6 py-2 text-red-500 bg-white border border-red-400 rounded-lg hover:bg-red-50 transition"
                >
                  Show Less ↑
                </button>
              </>
            )
          )}
        </div>
      </section>

      {/* ================================
         🧡 FINAL CTA (ONLY FOR NON-LOGGED USERS)
      ================================== */}
      {!user && (
        <section className="px-6 py-16 bg-[var(--btn)] text-white text-center rounded-t-3xl mt-16">
          <h2 className="text-3xl font-bold mb-4">Join the BookSwap Circle Today!</h2>

          <p className="max-w-xl mx-auto mb-6">
            Swap books, save money, and meet readers near you. Be part of an amazing community!
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-white text-[var(--btn)] font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Sign Up For Free
          </button>
        </section>
      )}

      {/* ================================
         📚 AVAILABLE BOOK GRID
      ================================== */}
      <section className="px-6 py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Books</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              owner={{ name: b.ownerId }}
              onRequest={onRequest}
              onWish={onWish}
            />
          ))}
        </div>
      </section>

      {/* 📦 Request Modal */}
      {showReq && selected && (
        <RequestModal
          book={selected}
          onClose={() => setShowReq(false)}
          onCreated={() => alert("Request sent successfully")}
        />
      )}
    </div>
  );
}
