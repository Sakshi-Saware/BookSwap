// src/pages/BookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mock } from "../services/mockService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews and Likes
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);

    const b = await mock.getBook(id);
    setBook(b);

    if (b) {
      const o = await mock.getUser(b.ownerId);
      setOwner(o);

      // Load reviews (UI only, backend added later)
      const rev = await mock.listReviews(id);
      setReviews(rev || []);

      // Likes
      const likeData = await mock.getLikes(id);
      setLikes(likeData.count);
      setLikedByUser(likeData.likedByMe);
    }
    setLoading(false);
  }

  async function handleReviewSubmit() {
    if (!user) return alert("Please login first");

    if (!newReview.trim()) return;

    // Save review
    await mock.addReview(book.id, user.uid, newReview.trim());

    // Send review notification with correct bookId
    await mock.addNotification(
      book.ownerId,
      `${user.displayName || "Someone"} reviewed your book`,
      {
        bookId: book.id
      }
    );

    setNewReview("");
    load();
  }


  async function toggleLike() {
    if (!user) return alert("Please login first");

    const updated = await mock.toggleLike(book.id, user.uid);
    setLikes(updated.count);
    setLikedByUser(updated.likedByMe);
  }

  async function handleRequest() {
    if (!user) return alert("Please log in first");

    await mock.createRequest({
      bookId: book.id,
      fromUid: user.uid,
      toUid: book.ownerId,
      type: "Borrow",
      message: `Request to borrow ${book.title}`,
      deposit: book.deposit || 0,
      paymentMethod: "None",
      pickupMethod: "In Person",
      dueDate: null
    });

    alert("Request sent!");
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!book) return <div className="p-6">Book not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* ================================ */}
      {/* BOOK HEADER */}
      {/* ================================ */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow">

        {/* Book Cover */}
        <motion.div
          className="w-56 h-80 bg-gray-100 rounded-lg overflow-hidden shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {book.cover ? (
            <img src={book.cover} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No Cover</div>
          )}
        </motion.div>

        {/* Book Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600 text-lg">{book.author}</p>

          <div className="flex items-center gap-3 mt-2">
            {(book.genre || []).map((g, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded-lg">
                {g}
              </span>
            ))}
          </div>

          <div className="text-gray-700 leading-relaxed mt-3">
            {book.description}
          </div>

          {/* LIKE BUTTON */}
          <button
            onClick={toggleLike}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            {likedByUser ? "❤️ Liked" : "🤍 Like"} ({likes})
          </button>

          {/* REQUEST BUTTON */}
          <button
            onClick={handleRequest}
            disabled={!book.available}
            className={`mt-4 px-6 py-3 rounded-lg text-white font-medium shadow 
              ${book.available ? "bg-[var(--btn)]" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {book.available ? "Request to Borrow / Swap" : "Not Available"}
          </button>
        </div>
      </div>

      {/* ================================ */}
      {/* OWNER INFO */}
      {/* ================================ */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">About the Owner</h2>

        <div className="flex items-center gap-4">
          <img
            src={owner?.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            className="w-16 h-16 rounded-full object-cover border"
          />

          <div>
            <p className="text-gray-500 font-semibold text-lg">{owner?.name}</p>
            <p className="text-gray-500 text-sm">⭐ {owner?.rating || 4.5}</p>
            <p className="text-gray-600 text-sm">{book.location}</p>
          </div>
        </div>
      </section>

      {/* ================================ */}
      {/* REVIEWS */}
      {/* ================================ */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>

        <div className="space-y-4 mb-6">
          {reviews.length === 0 && (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}

          {reviews.map((r) => (
            <div key={r.id} className="p-3 border rounded-lg bg-gray-50">
              <p className="font-medium">{r.userName}</p>
              <p className="text-gray-600 text-sm">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Add Review */}
        <textarea
          className="w-full border p-3 rounded-lg"
          rows="3"
          placeholder="Write your review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        ></textarea>

        <button
          onClick={handleReviewSubmit}
          className="mt-3 px-6 py-2 bg-[var(--btn)] text-white rounded-lg"
        >
          Submit Review
        </button>
      </section>

    </div>
  );
}
