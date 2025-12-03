import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import BookCard from "../components/BookCard";
import { mock } from "../services/mockService";

export default function MyBookshelf() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [removingBookId, setRemovingBookId] = useState(null);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    loadBooks();
  }, [user]);

  // ✅ Load all books owned by the user
  async function loadBooks() {
    try {
      const all = await mock.listBooks();
      const mine = all.filter((b) => b.ownerId === user?.uid);
      setBooks(mine);
    } catch (err) {
      console.error("Error loading books:", err);
    }
  }

  // ✅ Add new book
  async function handleAdd(book) {
    if (!user) {
      alert("Please log in to add a book");
      nav("/login");
      return;
    }
    try {
      book.ownerId = user.uid;
      await mock.addBook(book);
      await loadBooks();
      alert("📚 Book added to your bookshelf!");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Check console for details.");
    }
  }

  // ✅ Update existing book
  async function handleUpdate(id, updatedData) {
    try {
      await mock.updateBook(id, updatedData);
      setEditingBook(null);
      await loadBooks();
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book. See console for details.");
    }
  }

  // ✅ Remove book (smooth removal)
  async function handleRemove(id) {
    try {
      setRemovingBookId(id);
      setTimeout(async () => {
        await mock.deleteBook(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
      }, 300);
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book. Check console for details.");
    }
  }

  // ✅ Edit book
  function handleEdit(book) {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-4 min-h-screen bg-[var(--bg-light)]">
      <h2 className="text-xl font-semibold mb-4 text-center">📚 My Bookshelf</h2>

      {/* Add/Edit Book Form */}
      <div className="mb-8">
        <BookForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editingBook={editingBook}
        />
      </div>

      {/* Books Display */}
      {books.length === 0 ? (
        <p className="text-center text-gray-600">
          No books yet. Add your first book above!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {books.map((b) => (
            <div
              key={b.id}
              className={`transition-all duration-300 ${
                removingBookId === b.id ? "opacity-0 scale-95" : "opacity-100"
              }`}
            >
              <BookCard
                book={b}
                owner={{ name: user?.displayName || "You" }}
                onEdit={() => handleEdit(b)}
                onRemove={() => handleRemove(b.id)}
                mode="owner"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
