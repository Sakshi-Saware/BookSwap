import React, { useState, useEffect, useRef } from "react";

export default function BookForm({ onAdd, onUpdate, editingBook }) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    cond: "Good",
    author: "",
    genre: "",
    deposit: "",
    location: "",
  });
  const [cover, setCover] = useState(null);
  const fileRef = useRef(null);

  // ✅ Load existing book data when editing
  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title || "",
        desc: editingBook.description || "",
        cond: editingBook.condition || "Good",
        author: editingBook.author || "",
        genre:
          Array.isArray(editingBook.genre) && editingBook.genre.length > 0
            ? editingBook.genre.join(", ")
            : editingBook.genre || "",
        deposit: editingBook.deposit || "",
        location: editingBook.location || "",
      });
      setCover(editingBook.cover || null);
    } else {
      // Reset when no book is being edited
      setForm({
        title: "",
        desc: "",
        cond: "Good",
        author: "",
        genre: "",
        deposit: "",
        location: "",
      });
      setCover(null);
    }
  }, [editingBook]);

  // ✅ Handle form input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Handle file upload
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  }

  // ✅ Handle add or update
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.author) {
      alert("⚠️ Please fill out the required fields.");
      return;
    }

    // Convert comma-separated genres → array
    const genres = form.genre
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g);

    const bookData = {
      title: form.title.trim(),
      description: form.desc.trim(),
      condition: form.cond,
      author: form.author.trim(),
      genre: genres,
      deposit: Number(form.deposit || 0),
      location: form.location.trim(),
      cover,
      swapOnly: false,
      available: true,
      photoEvidence: [],
    };

    try {
      if (editingBook) {
        await onUpdate(editingBook.id, bookData);
        alert("✅ Book details updated successfully!");
      } else {
        await onAdd(bookData);
        alert("✅ Book added successfully!");
      }

      // Reset form after submission
      setForm({
        title: "",
        desc: "",
        cond: "Good",
        author: "",
        genre: "",
        deposit: "",
        location: "",
      });
      setCover(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Error saving book:", err);
      alert("❌ Failed to save book. Check console for details.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 transition-all duration-300"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {editingBook ? "✏️ Edit Book" : "➕ Add New Book"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          required
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
        />
        <input
          required
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
        />

        <select
          name="cond"
          value={form.cond}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
        >
          <option>New</option>
          <option>Good</option>
          <option>Readable</option>
        </select>

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Owner Location"
          className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
        />

        <input
          name="deposit"
          type="number"
          value={form.deposit}
          onChange={handleChange}
          placeholder="Deposit (₹)"
          className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
        />
      </div>

      <textarea
        name="desc"
        value={form.desc}
        onChange={handleChange}
        placeholder="Book Description..."
        className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
      />

      {/* ✅ Multiple Genres Input */}
      <input
        name="genre"
        value={form.genre}
        onChange={handleChange}
        placeholder="Genres (separate with commas, e.g. Fantasy, Mystery, Romance)"
        className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--btn)]"
      />

      {/* ✅ File Upload & Preview */}
      <div className="flex items-center gap-3 mt-2">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFile}
          className="text-sm"
        />
        {cover && (
          <img
            src={cover}
            alt="Preview"
            className="w-20 h-24 object-cover rounded border"
          />
        )}
        <button
          type="submit"
          className="ml-auto px-4 py-2 rounded text-white hover:opacity-90"
          style={{ background: "var(--btn)" }}
        >
          {editingBook ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
