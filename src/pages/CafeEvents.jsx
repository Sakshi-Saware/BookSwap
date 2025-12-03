// src/pages/CafeEvents.jsx
import { useEffect, useState } from "react";
import CafeLayout from "../components/CafeLayout";
import { cafeEventsAPI } from "../services/mockCafeServices";
import { useNavigate } from "react-router-dom";

export default function CafeEvents() {
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    setEvents(cafeEventsAPI.getAllEvents());
  }, []);

  return (
    <CafeLayout>

      {/* PAGE TITLE + CREATE EVENT BUTTON */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Events
        </h1>

        <button
          onClick={() => nav("/cafe/events/new")}
          className="px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow hover:bg-[#3a78c0] transition"
        >
          + Create Event
        </button>
      </div>

      {/* NO EVENTS MESSAGE */}
      {events.length === 0 && (
        <div className="text-center text-gray-500 py-20 text-xl">
          No events found. Create your first event!
        </div>
      )}

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition"
            onClick={() => nav(`/cafe/events/${event.id}`)}
          >
            {/* Event Banner */}
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-44 object-cover"
            />

            {/* Card Details */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">{event.date}</p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {event.attendees.length} attendees
                </span>

                <button
                  className="text-[#4a90e2] font-medium hover:underline"
                  onClick={() => nav(`/cafe/events/${event.id}`)}
                >
                  View →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </CafeLayout>
  );
}
