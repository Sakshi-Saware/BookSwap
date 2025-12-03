// src/components/GenreTags.jsx
import React, { useState } from "react";

export default function GenreTags({ value = [], onChange, suggestions = [] }) {
  const [input, setInput] = useState("");
  const tags = Array.isArray(value) ? value : [];

  function addTag(t) {
    if (!t) return;
    if (!tags.includes(t)) onChange([...tags, t]);
    setInput("");
  }
  function removeTag(t) {
    onChange(tags.filter(x => x !== t));
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input.trim());
    }
    if (e.key === "," ) {
      e.preventDefault();
      addTag(input.replace(",", "").trim());
    }
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map(t => (
          <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
            {t}
            <button type="button" onClick={() => removeTag(t)} className="text-gray-500">✕</button>
          </span>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type genre and press Enter"
        className="w-full border p-2 rounded"
      />

      {suggestions?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => addTag(s)} className="text-xs px-2 py-1 bg-gray-50 rounded border">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
