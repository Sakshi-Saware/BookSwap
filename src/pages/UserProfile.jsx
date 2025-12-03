import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mock } from "../services/mockService";

export default function UserProfile() {
  const { uid } = useParams(); // /user/:uid
  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const user = await mock.getUser(uid);
      const allBooks = await mock.listBooks();
      const uploaded = allBooks.filter((b) => b.ownerId === uid);
      setUserData(user);
      setBooks(uploaded);
      setLoading(false);
    }
    loadProfile();
  }, [uid]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );

  if (!userData)
    return (
      <div className="p-6 text-center text-gray-500">
        User not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-500">
          {userData.name.charAt(0)}
        </div>

        {/* User Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{userData.name}</h2>
          <p className="text-gray-600">{userData.location}</p>

          <div className="mt-2 text-yellow-500 font-medium">
            ⭐ {userData.rating.toFixed(1)}
          </div>

          {/* Badges */}
          {userData.badges?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {userData.badges.map((b, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* 💬 Message Button */}
          <button
            onClick={() => nav(`/peers?chat=${uid}`)}
            className="mt-4 bg-[var(--btn)] text-white px-4 py-2 rounded shadow hover:opacity-90 transition"
          >
            💬 Message
          </button>
        </div>
      </div>

      {/* Uploaded Books */}
      <div>
        <h3 className="text-xl font-semibold mb-3">📚 Uploaded Books</h3>
        {books.length === 0 ? (
          <p className="text-gray-500">No books uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <h4 className="font-medium text-lg">{book.title}</h4>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-xs text-gray-400 mt-1">{book.genre}</p>
                <p className="text-xs text-gray-400">
                  Condition: {book.condition}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Location: {book.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
