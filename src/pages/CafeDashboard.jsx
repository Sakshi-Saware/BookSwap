// src/pages/CafeDashboard.jsx
import { useEffect, useState } from "react";
import CafeLayout from "../components/CafeLayout";
import { cafeEventsAPI } from "../services/mockCafeServices";
import { useNavigate } from "react-router-dom";

export default function CafeDashboard() {
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    setEvents(cafeEventsAPI.getAllEvents());
  }, []);

  return (
    <CafeLayout>

      {/* PAGE TITLE + CREATE BUTTON */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>

        <button
          onClick={() => nav("/cafe/events/new")}
          className="px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow hover:bg-[#3a78c0] transition"
        >
          + Create Event
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* Total Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Events</p>
          <p className="text-3xl font-bold mt-2">{events.length}</p>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Upcoming Events</p>
          <p className="text-3xl font-bold mt-2">
            {events.filter(ev => new Date(ev.date) >= new Date()).length}
          </p>
        </div>

        {/* Total Attendees */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Attendees</p>
          <p className="text-3xl font-bold mt-2">
            {events.reduce((sum, ev) => sum + ev.attendees.length, 0)}
          </p>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Messages</p>
          <p className="text-3xl font-bold mt-2">–</p>
        </div>
      </div>

      {/* RECENT EVENTS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition"
              onClick={() => nav(`/cafe/events/${event.id}`)}
            >
              <img
                src={event.banner}
                className="w-full h-40 object-cover"
                alt={event.title}
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{event.date}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {event.attendees.length} attendees
                  </span>

                  <button className="text-[#4a90e2] font-medium hover:underline">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* No Events State */}
          {events.length === 0 && (
            <div className="text-center text-gray-500 col-span-full py-10">
              No events yet. Create one!
            </div>
          )}
        </div>
      </div>

    </CafeLayout>
  );
}
