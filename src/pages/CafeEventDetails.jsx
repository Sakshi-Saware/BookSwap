// src/pages/CafeEventDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import CafeLayout from "../components/CafeLayout";
import AttendeeList from "../components/AttendeeList";
import { cafeEventsAPI } from "../services/mockCafeServices";
import { useEffect, useState } from "react";

export default function CafeEventDetails() {
  const { eventId } = useParams();
  const nav = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    const ev = cafeEventsAPI.getEvent(eventId);

    // SAFE DEFAULTS to prevent crashes
    if (ev) {
      setEvent({
        ...ev,
        attendees: ev.attendees || [],
        reviews: ev.reviews || [],
        comments: ev.comments || [],
        host: ev.host || "Your Café",
        location: ev.location || "Café Address",
      });
    }
  }, [eventId]);

  if (!event) {
    return (
      <CafeLayout>
        <div className="text-center text-gray-500 py-20 text-xl">Loading...</div>
      </CafeLayout>
    );
  }

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <CafeLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{event.title}</h1>

        <button
          onClick={() => nav(`/cafe/events/${eventId}/edit`)}
          className="px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow hover:bg-[#3a78c0] transition"
        >
          Edit Event
        </button>
      </div>

      {/* MAIN INFO CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">

        {/* BANNER */}
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl shadow-sm"
        />

        {/* DETAILS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">

            <div>
              <p className="text-sm text-gray-500 font-medium">Event Name</p>
              <p className="text-xl font-semibold text-gray-800">{event.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Description</p>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div>
              <p className="text-sm text-gray-500 font-medium">Date</p>
              <p className="text-lg font-semibold text-gray-800">{event.date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Time</p>
              <p className="text-lg font-semibold text-gray-800">{event.time}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Location</p>
              <p className="text-lg font-semibold text-gray-800">
                {event.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Host</p>
              <p className="text-lg font-semibold text-gray-800">
                {event.host}
              </p>
            </div>

            {!isPastEvent && (
              <div>
                <p className="text-sm text-gray-500 font-medium">Max Attendees</p>
                <p className="text-lg font-semibold text-gray-800">
                  {event.maxAttendees || "Not specified"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATTENDEES */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendees</h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <AttendeeList attendees={event.attendees} />
        </div>
      </div>

      {/* REVIEWS (Only Past Events) */}
      {isPastEvent && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>

          {event.reviews.length > 0 ? (
            <div className="space-y-4">
              {event.reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                >
                  <p className="text-lg font-semibold text-gray-800">{review.user}</p>
                  <p className="text-sm text-gray-500">{review.rating} ★</p>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-6">No reviews yet.</div>
          )}
        </div>
      )}

    </CafeLayout>
  );
}
