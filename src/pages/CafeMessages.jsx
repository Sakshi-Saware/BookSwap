// src/pages/CafeMessages.jsx
import { useEffect, useState } from "react";
import { cafeMessagesAPI } from "../services/mockCafeServices";
import CafeLayout from "../components/CafeLayout";

export default function CafeMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const convos = cafeMessagesAPI.getConversations();
    setConversations(convos);
    if (convos.length > 0) setActiveConvo(convos[0]);
  }, []);

  function sendMessage() {
    if (!message.trim() || !activeConvo) return;

    cafeMessagesAPI.sendMessage(activeConvo.conversationId, message);

    const updated = cafeMessagesAPI.getMessages(activeConvo.conversationId);
    setActiveConvo({ ...updated });
    setConversations([...cafeMessagesAPI.getConversations()]);
    setMessage("");
  }

  return (
    <CafeLayout>

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-10">
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE — CONVERSATION LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[75vh] overflow-y-auto">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Conversations
          </h2>

          <div className="space-y-3">
            {conversations.map((convo) => (
              <div
                key={convo.conversationId}
                onClick={() => setActiveConvo(convo)}
                className={`p-4 rounded-xl cursor-pointer transition shadow-sm border ${
                  activeConvo?.conversationId === convo.conversationId
                    ? "bg-[#e8f1fe] border-[#c2d6fa]"
                    : "bg-white hover:bg-gray-100 border-gray-200"
                }`}
              >
                <p className="font-semibold text-gray-800">{convo.userName}</p>
                <p className="text-gray-500 text-sm mt-1">{convo.lastMessage}</p>
              </div>
            ))}

            {conversations.length === 0 && (
              <p className="text-gray-500 text-center py-10">
                No conversations found.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — CHAT WINDOW */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 col-span-2 flex flex-col h-[75vh]">

          {/* CHAT HEADER */}
          {activeConvo ? (
            <>
              <div className="pb-4 mb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeConvo.userName}
                </h2>
                <p className="text-sm text-gray-500">Active now</p>
              </div>

              {/* MESSAGE LIST */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {activeConvo.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                      msg.from === "cafe"
                        ? "bg-[#d7e9ff] self-end"
                        : "bg-gray-100"
                    }`}
                  >
                    <p className="text-gray-800">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                  </div>
                ))}
              </div>

              {/* MESSAGE INPUT */}
              <div className="mt-4 flex items-center gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-[#4a90e2] text-white font-semibold rounded-xl shadow hover:bg-[#3a78c0]"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </CafeLayout>
  );
}
