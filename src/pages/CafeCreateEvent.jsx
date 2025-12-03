// src/pages/CafeCreateEvent.jsx
import CafeLayout from "../components/CafeLayout";
import { useState } from "react";
import { cafeEventsAPI } from "../services/mockCafeServices";
import { useNavigate } from "react-router-dom";
import { useCafeAuth } from "../context/CafeAuthContext";

export default function CafeCreateEvent() {
  const nav = useNavigate();
  const { cafe } = useCafeAuth();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    banner: "",
    maxAttendees: "",
    host: cafe?.name || "Your Café",
  });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();

    // VALIDATION ------------------------------

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.banner.trim() ||
      !form.date ||
      !form.time ||
      !form.location.trim() ||
      !form.maxAttendees
    ) {
      alert("All fields are required.");
      return;
    }

    // Prevent past dates
    if (new Date(form.date) < new Date(today)) {
      alert("You cannot create an event for a past date.");
      return;
    }

    // SAVE EVENT ------------------------------
    cafeEventsAPI.createEvent({
      ...form,
      attendees: [],
      reviews: [],
    });

    nav("/cafe/events");
  }

  return (
    <CafeLayout>
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Create Event
        </h1>

        <button
          onClick={() => nav("/cafe/events")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium shadow hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

      {/* MAIN FORM CARD */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Title */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Event Title *</p>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Description *</p>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              ></textarea>
            </div>

            {/* Banner Image */}
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Event Banner (Image URL) *
              </p>
              <input
                type="text"
                value={form.banner}
                onChange={(e) => setField("banner", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Date */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Date *</p>
              <input
                type="date"
                value={form.date}
                min={today}
                onChange={(e) => setField("date", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

            {/* Time */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Time *</p>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setField("time", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

            {/* Location */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Location *</p>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Your café address"
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

            {/* Host */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Host</p>
              <input
                type="text"
                value={form.host}
                disabled
                className="w-full border p-3 rounded-xl mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Max Attendees */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Max Attendees *</p>
              <input
                type="number"
                value={form.maxAttendees}
                onChange={(e) => setField("maxAttendees", e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
                required
              />
            </div>

          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-10">
          <button
            type="submit"
            className="px-8 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow hover:bg-[#3a78c0] transition"
          >
            Create Event
          </button>
        </div>
      </form>
    </CafeLayout>
  );
}
