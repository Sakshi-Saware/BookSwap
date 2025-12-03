// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mock } from "../services/mockService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const [myBooks, setMyBooks] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [lent, setLent] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!user) return nav("/login");
    loadProfile();
  }, [user]);

  async function loadProfile() {
    const uid = user.uid;

    const allBooks = await mock.listBooks();
    const outgoing = await mock.listOutgoingRequests(uid);
    const incoming = await mock.listIncomingRequests(uid);
    const profile = await mock.getUser(uid);

    setUserDetails(profile);

    setMyBooks(allBooks.filter((b) => b.ownerId === uid));
    setBorrowed(outgoing.filter((r) => r.status === "Returned"));
    setLent(incoming.filter((r) => r.status === "Returned"));
  }

  if (!user) return null;

  // Profile picture priority
  const profilePhoto =
    user.photoURL ||
    userDetails?.photo ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* =============================== */}
      {/* HEADER: Profile Overview        */}
      {/* =============================== */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: Avatar + Basic Details */}
        <div className="flex items-center gap-6">
          <img
            src={profilePhoto}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border shadow"
          />

          <div>
            <h2 className="text-3xl font-semibold">
              {userDetails?.name || user.displayName || "Book Lover"}
            </h2>

            <p className="text-gray-600 text-sm">
              {userDetails?.location || "No location added"}
            </p>

            {userDetails?.genres?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {userDetails.genres.map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Profile Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button
            onClick={() => nav("/edit-profile")}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            ✏️ Edit Profile
          </button>

          <button
            onClick={() => nav("/wishlist")}
            className="px-4 py-2 bg-[var(--btn)] text-white rounded shadow hover:opacity-90"
          >
            ❤️ Wishlist
          </button>

          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* =============================== */}
      {/* ABOUT ME SECTION                */}
      {/* =============================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-2xl font-semibold mb-4">👤 About Me</h3>

        <p className="text-gray-700 mb-3">
          {userDetails?.bio || "No bio added yet."}
        </p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>📧 {user.email}</p>
          {userDetails?.phone && <p>📞 {userDetails.phone}</p>}
          {userDetails?.location && <p>📍 {userDetails.location}</p>}
        </div>
      </div>

      {/* =============================== */}
      {/* BOOK SECTIONS                   */}
      {/* =============================== */}

      <ProfileSection
        title="📚 My Bookshelf"
        items={myBooks}
        empty="You have not added any books yet."
      />

      <ProfileSection
        title="📘 Borrowed Books"
        items={borrowed}
        empty="You haven't borrowed any books yet."
        isRequest
      />

      <ProfileSection
        title="📕 Lent Out"
        items={lent}
        empty="No books lent yet."
        isRequest
      />
    </div>
  );
}

/* ===============================
   REUSABLE PROFILE SECTION 
=============================== */

function ProfileSection({ title, items, empty, isRequest }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>

      {items.length === 0 ? (
        <p className="text-gray-500">{empty}</p>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{it.title || "Untitled Book"}</h4>
                <p className="text-sm text-gray-600">{it.author}</p>
              </div>

              {isRequest ? (
                <span className="text-green-600 text-sm">Returned</span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                  {it.condition || "Unknown"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
