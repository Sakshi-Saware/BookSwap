import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { mock } from "../services/mockService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Peers() {
  const { user } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [friends, setFriends] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [newMsg, setNewMsg] = useState("");

  // 🧠 Normalize UID safely
  const myUid = user?.uid && user?.uid !== "undefined" ? user.uid : "me_dummy";

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    loadFriends();
  }, [user]);

  
  // 🔗 Preselect chat from URL (?chat=uid)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetChat = params.get("chat");
    if (targetChat) openChat(targetChat);
  }, [location]);

  async function loadFriends() {
    const fIds = await mock.listFriends(myUid);
    const allUsers = await mock.listUsers();
    const myFriends = allUsers.filter((u) => fIds.includes(u.uid));
    setFriends(myFriends);
    setFiltered(myFriends);
  }

  function handleSearch(e) {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    if (!q) return setFiltered(friends);
    const res = friends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.location && f.location.toLowerCase().includes(q))
    );
    setFiltered(res);
  }

  // ✅ Open chat safely
  async function openChat(friendId) {
    const chats = await mock.getChats();

    const chat = chats.find(
      (c) =>
        Array.isArray(c.participants) &&
        c.participants.includes(myUid) &&
        c.participants.includes(friendId)
    );

    setMessages(chat ? chat.messages : []);
    setSelectedChat(friendId);
  }

  // ✅ Send message + refresh chat from mock
  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim() || !selectedChat) return;

    await mock.sendMessage(myUid, selectedChat, newMsg.trim());
    setNewMsg("");

    // Refresh from storage for reliability
    const updatedChats = await mock.getChats();
    const chat = updatedChats.find(
      (c) => c.participants.includes(myUid) && c.participants.includes(selectedChat)
    );
    setMessages(chat ? chat.messages : []);

    // 🔄 Reload friends (in case new contact was added)
    loadFriends();
  }

  return (
    <div className="flex flex-col md:flex-row p-4 min-h-screen">
      {/* Left: Friend List */}
      <div className="md:w-1/3 border-r pr-3">
        <h2 className="text-xl font-semibold mb-3 text-center">💬 My Peers</h2>

        {/* Search Bar */}
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search peers..."
          className="w-full border rounded p-2 mb-3 text-sm"
        />

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No peers found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((f) => (
              <button
                key={f.uid}
                onClick={() => openChat(f.uid)}
                className={`w-full text-left p-2 rounded ${
                  selectedChat === f.uid
                    ? "bg-[var(--accent)] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-gray-500">{f.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Chat Window */}
      <div className="md:flex-1 md:pl-4 mt-4 md:mt-0 flex flex-col">
        {selectedChat ? (
          <>
            <h3 className="font-semibold mb-2">
              Chat with {friends.find((f) => f.uid === selectedChat)?.name || "User"}
            </h3>
            <div className="bg-white rounded shadow p-3 h-[25vh] overflow-y-auto space-y-2 flex-1">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  No messages yet.
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] ${
                      m.sender === myUid ? "ml-auto text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        m.sender === myUid
                          ? "bg-[var(--accent)] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {dayjs(m.at).fromNow()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message input */}
            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded p-2"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded text-white"
                style={{ background: "var(--btn)" }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a peer to view chat.
          </div>
        )}
      </div>
    </div>
  );
}
