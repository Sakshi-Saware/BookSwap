// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { mock } from "../services/mockService";
import BookCard from "../components/BookCard";

export default function Wishlist() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    loadWishlist();
  }, [user]);

  async function loadWishlist() {
    const ids = await mock.getWishlist(user.uid || "me_dummy");
    const all = await mock.listBooks();
    const list = all.filter((b) => ids.includes(b.id));
    setBooks(list);
  }

  // 👇 Remove a book and update instantly
  async function handleRemove(bookId) {
    await mock.removeFromWishlist(user.uid || "me_dummy", bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-center">❤️ My Wishlist</h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books wishlisted yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {books.map((b) => (
            <BookCard
            key={b.id}
            book={b}
            owner={{ name: "Unknown" }}
            onRequest={() => {}}
            onWish={() => handleRemove(b.id)}
            inWishlist={true}  // ✅ shows “Remove from Wishlist” button
            />
          ))}
        </div>
      )}
    </div>
  );
}
