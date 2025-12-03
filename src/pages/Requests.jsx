// src/pages/Requests.jsx
import React, { useEffect, useState } from "react";
import { mock } from "../services/mockService";
import { useAuth } from "../context/AuthContext";

export default function Requests() {
  const { user } = useAuth();
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});
  const [activeTab, setActiveTab] = useState("outgoing");

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    const [out, inc, allBooks, allUsers] = await Promise.all([
      mock.listOutgoingRequests(user.uid),
      mock.listIncomingRequests(user.uid),
      mock.listBooks(),
      mock.listUsers(),
    ]);

    const userMap = {};
    allUsers.forEach((u) => (userMap[u.uid] = u));
    setUsersMap(userMap);

    const attachBook = (r) => ({
      ...r,
      book: allBooks.find((b) => b.id === r.bookId),
    });

    setOutgoing(out.map(attachBook));
    setIncoming(inc.map(attachBook));
    setLoading(false);
  }

  async function handleStatus(reqId, status) {
    await mock.updateRequestStatus(reqId, status);
    alert(`✅ Request marked as ${status}`);
    load();
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 text-lg animate-pulse">
        Loading your requests...
      </div>
    );

  // 🔖 Color-coded status chip
  const StatusTag = ({ status }) => {
    const colors = {
      Pending: "bg-gray-100 text-gray-700",
      Accepted: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-600",
      Returned: "bg-blue-100 text-blue-700",
      Cancelled: "bg-gray-200 text-gray-500",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-500"}`}
      >
        {status}
      </span>
    );
  };

  const RequestCard = ({ r, type }) => (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex gap-4 items-center">
      {/* Book Cover */}
      <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {r.book?.cover ? (
          <img
            src={r.book.cover}
            alt={r.book.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-xs text-gray-400">No Cover</span>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1">
        <h4 className="font-semibold text-lg text-gray-800">
          {r.book?.title || "Unknown Book"}
        </h4>
        <p className="text-sm text-gray-500 mb-1">
          {type === "out"
            ? `Requested from: `
            : `Requested by: `}
          <span className="font-medium text-blue-600">
            {usersMap[type === "out" ? r.toUid : r.fromUid]?.name ||
              "Unknown User"}
          </span>
        </p>

        <div className="flex items-center gap-2 mb-2">
          <StatusTag status={r.status} />
          <span className="text-xs text-gray-400">
            {new Date(r.timeline[0]?.ts).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {r.status === "Pending" && type === "out" && (
            <button
              onClick={() => handleStatus(r.id, "Cancelled")}
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
            >
              Cancel
            </button>
          )}

          {r.status === "Pending" && type === "in" && (
            <>
              <button
                onClick={() => handleStatus(r.id, "Accepted")}
                className="px-3 py-1 rounded bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatus(r.id, "Rejected")}
                className="px-3 py-1 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Reject
              </button>
            </>
          )}

          {r.status === "Accepted" && type === "in" && (
            <button
              onClick={() => handleStatus(r.id, "Returned")}
              className="px-3 py-1 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Mark Returned
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">📦 My Requests</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-6 py-2 font-medium border-b-2 ${
            activeTab === "outgoing"
              ? "border-[var(--btn)] text-[var(--btn)]"
              : "border-transparent text-gray-500 hover:text-[var(--btn)]"
          }`}
        >
          Outgoing Requests
        </button>
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-6 py-2 font-medium border-b-2 ${
            activeTab === "incoming"
              ? "border-[var(--btn)] text-[var(--btn)]"
              : "border-transparent text-gray-500 hover:text-[var(--btn)]"
          }`}
        >
          Incoming Requests
        </button>
      </div>

      {/* Requests Section */}
      {activeTab === "outgoing" ? (
        outgoing.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            You haven’t made any requests yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {outgoing.map((r) => (
              <RequestCard key={r.id} r={r} type="out" />
            ))}
          </div>
        )
      ) : incoming.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">
          No one has requested your books yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {incoming.map((r) => (
            <RequestCard key={r.id} r={r} type="in" />
          ))}
        </div>
      )}
    </div>
  );
}
