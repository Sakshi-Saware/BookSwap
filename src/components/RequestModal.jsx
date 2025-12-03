// src/components/RequestModal.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mock } from "../services/mockService";
import dayjs from "dayjs";

export default function RequestModal({ book, onClose, onCreated }) {
  const { user } = useAuth();
  const [type, setType] = useState(book.swapOnly ? "Swap" : "Borrow");
  const [duration, setDuration] = useState("1 week");
  const [customDate, setCustomDate] = useState("");
  const [pickup, setPickup] = useState("Meet in person");
  const [paymentMethod, setPaymentMethod] = useState("Wallet");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(true);

  const submit = async () => {
    // 🧩 Skip login / verification restrictions — allow all logged-in users
    if (!user) {
      alert("Please log in to continue.");
      return;
    }

    if (!agree) {
      alert("You must agree to return the book on time to proceed.");
      return;
    }

    setLoading(true);

    // Calculate due date
    const dueDate =
      duration === "Custom" && customDate
        ? dayjs(customDate).toISOString()
        : dayjs()
            .add(
              duration === "1 week" ? 7 : duration === "2 weeks" ? 14 : 30,
              "day"
            )
            .toISOString();

    const deposit = type === "Borrow" && book.deposit ? book.deposit : 0;

    try {
      const req = await mock.createRequest({
        bookId: book.id,
        fromUid: user.uid || "me_dummy",
        toUid: book.ownerId,
        type,
        message,
        dueDate,
        deposit,
        paymentMethod,
        pickupMethod: pickup,
      });

      alert("📬 Request sent successfully!");
      onCreated && onCreated(req);
      onClose && onClose();
    } catch (err) {
      alert("Failed to create request: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Request: {book.title}</h3>

        {/* Type Selector */}
        <div className="mb-2">
          Type:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            {!book.swapOnly && <option>Borrow</option>}
            <option>Swap</option>
          </select>
        </div>

        {/* Borrow Details */}
        {type === "Borrow" && (
          <>
            <div className="mb-2">
              Borrow Duration:
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>Custom</option>
              </select>
              {duration === "Custom" && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                />
              )}
            </div>

            <div className="mb-2">
              Deposit: <strong>₹{book.deposit || 0}</strong>
            </div>

            <div className="mb-2">
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option>Wallet</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </div>

            <div className="mb-2">
              Pickup:
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option>Meet in person</option>
                <option>Home delivery</option>
              </select>
            </div>
          </>
        )}

        {/* Message */}
        <div className="mb-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to owner (optional)"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Agreement */}
        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to return the book on time or forfeit my deposit.
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded text-white"
            style={{ background: "var(--btn)" }}
            onClick={submit}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : type === "Borrow"
              ? "Request Borrow"
              : "Request Swap"}
          </button>
        </div>
      </div>
    </div>
  );
}
