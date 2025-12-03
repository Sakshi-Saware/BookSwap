// src/pages/Chats.jsx
import React, { useEffect, useState } from "react";
import { mock } from "../services/mockService";

export default function Chats(){
  const [chats, setChats] = useState([]);
  useEffect(()=> load(), []);
  async function load(){ const c = await mock.getChats(); setChats(c); }
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Chats / Peers</h2>
      <div className="grid gap-3">
        {chats.map(c=>(
          <div key={c.chatId} className="bg-white p-3 rounded">
            <div className="font-semibold">{c.participants.join(", ")}</div>
            <div className="text-xs text-gray-500 mt-2">{c.messages.slice(-1)[0]?.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
