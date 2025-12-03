import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({
  book,
  owner,
  onRequest,
  onWish,
  onEdit,
  onRemove,
  inWishlist = false,
  mode = "default", // default = normal display, "owner" = MyBookshelf mode
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Book Cover */}
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-3">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-sm text-center p-2 text-gray-500">
            No Cover
          </span>
        )}
      </div>

      {/* Book Info */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <Link
            to={`/book/${book.id}`}
            className="font-semibold text-lg hover:underline line-clamp-1"
          >
            {book.title}
          </Link>
          <div className="text-sm text-gray-600 line-clamp-1">
            {book.author}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 rounded text-xs bg-[#F0E6DC]">
              {book.condition}
            </span>

            {/* ✅ Display genres (multiple if array) */}
            {Array.isArray(book.genre)
              ? book.genre.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {g}
                  </span>
                ))
              : book.genre && (
                  <span className="text-xs text-gray-500">{book.genre}</span>
                )}
          </div>
        </div>

        {/* ✅ Buttons Section */}
        <div className="mt-4 flex gap-2">
          {mode === "owner" ? (
            <>
              {/* Owner Buttons */}
              <button
                onClick={onEdit}
                className="flex-1 px-3 py-1 rounded text-sm font-medium text-white bg-[var(--btn)] hover:opacity-90 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={onRemove}
                className="flex-1 px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
              >
                ❌ Remove
              </button>
            </>
          ) : (
            <>
              {/* Default Swap/Wishlist Buttons */}
              <button
                onClick={() => onRequest(book)}
                className="px-3 py-1 flex-1 rounded text-sm font-medium text-white bg-[var(--btn)] hover:opacity-90 transition"
              >
                Swap / Borrow
              </button>
              <button
                onClick={() => onWish(book)}
                className="px-3 py-1 flex-1 rounded border text-sm font-medium hover:bg-gray-50 transition"
              >
                {inWishlist ? "❌ Remove" : "❤️ Wishlist"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Owner Info */}
      <div className="mt-3 text-right text-sm border-t pt-2">
        <div className="text-xs text-gray-500">{book.location}</div>
        <div className="mt-1">
          <Link
            to={`/user/${book.ownerId}`}
            className="text-blue-600 hover:underline"
          >
            {owner?.name || "Unknown"}
          </Link>
        </div>
      </div>
    </div>
  );
}
