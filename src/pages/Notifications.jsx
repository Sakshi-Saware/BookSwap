// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { mock } from "../services/mockService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [list, setList] = useState([]);

  /* ----------------------------------------------------
      LOAD NOTIFICATIONS
  ----------------------------------------------------- */
  useEffect(() => {
    if (!user) return nav("/login");

    async function load() {
      const notes = await mock.listNotifications(user.uid);
      setList(notes);

      // Mark all as seen
      await mock.markNotificationsSeen(user.uid);
    }

    load();
  }, [user]);


  /* ----------------------------------------------------
      HANDLE CLICK ON A NOTIFICATION
  ----------------------------------------------------- */
  function handleClick(note) {
    // 1️⃣ If notification contains bookId → direct
    if (note.bookId) {
      return nav(`/book/${note.bookId}`);
    }

    // 2️⃣ Fallback for older notifications: extract bookId from message
    const extract = note.message.match(/book_([a-z0-9]+)/i);
    if (extract && extract[1]) {
      const fallbackId = `book_${extract[1]}`;
      return nav(`/book/${fallbackId}`);
    }

    // 3️⃣ If no clue, go home
    nav("/");
  }


  /* ----------------------------------------------------
      RENDER UI
  ----------------------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🔔 Notifications</h2>

      {list.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No notifications yet.
        </p>
      ) : (
        <div className="space-y-4">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition border-l-4 border-[var(--btn)]"
            >
              <div className="font-medium text-[var(--text)]">{n.message}</div>

              {/* Optional sender */}
              {n.fromUid && (
                <div className="text-xs text-gray-500">
                  From: {n.fromUid}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
