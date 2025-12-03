// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { mock } from "../services/mockService";
import BookCard from "../components/BookCard";
import RequestModal from "../components/RequestModal";
import { useAuth } from "../context/AuthContext";

export default function Search() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showReq, setShowReq] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Extract ?genre= from URL (when clicked from Navbar)
  const params = new URLSearchParams(location.search);
  const selectedGenre = params.get("genre");

  // Load all books once
  useEffect(() => {
    async function loadBooks() {
      const all = await mock.listBooks();
      setBooks(all);
      setResults(all);
    }
    loadBooks();
  }, []);

  // 🔍 Combined Live Search + Genre Filter Logic
  useEffect(() => {
    let filtered = [...books];

    // If a genre is selected (from Browse)
    if (selectedGenre) {
      filtered = filtered.filter((b) => {
        const genres = Array.isArray(b.genre) ? b.genre : [b.genre || ""];
        return genres.some(
          (g) => g.toLowerCase() === selectedGenre.toLowerCase()
        );
      });
    }

    // Live search filtering (by title, author, or genre)
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((b) => {
        const genres = Array.isArray(b.genre) ? b.genre : [b.genre || ""];
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          genres.some((g) => g.toLowerCase().includes(q))
        );
      });
    }

    setResults(filtered);
  }, [query, selectedGenre, books]);

  async function onWish(book) {
    const uid = user ? user.uid : "guest";
    await mock.addToWishlist(uid, book.id);
    alert("❤️ Added to wishlist!");
  }

  return (
    <div className="p-6 min-h-screen bg-[var(--bg)]">
      {/* 🔍 Search Input */}
      <div className="flex items-center gap-2 mb-4 max-w-3xl mx-auto">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or genre..."
          className="border rounded px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--btn)]"
        />
      </div>

      {/* 🏷️ Genre Info */}
      {selectedGenre && (
        <div className="text-center mb-6 text-gray-700">
          <span>
            Showing results for genre:{" "}
            <strong className="text-[var(--btn)]">{selectedGenre}</strong>
          </span>
        </div>
      )}

      {/* 📚 Results */}
      {results.length === 0 ? (
        <div className="text-gray-500 text-center mt-10 text-lg">
          {selectedGenre
            ? `No books found in the genre "${selectedGenre}".`
            : "No books match your search."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300">
          {results.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              owner={{ name: b.ownerId }}
              onRequest={(bk) => {
                setSelected(bk);
                setShowReq(true);
              }}
              onWish={onWish}
            />
          ))}
        </div>
      )}

      {/* 📦 Request Modal */}
      {showReq && selected && (
        <RequestModal
          book={selected}
          onClose={() => setShowReq(false)}
          onCreated={() => alert("✅ Request sent successfully!")}
        />
      )}
    </div>
  );
}
