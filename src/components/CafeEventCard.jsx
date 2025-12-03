// src/components/CafeEventCard.jsx
import { Link } from "react-router-dom";

export default function CafeEventCard({ event }) {
  return (
    <div className="bg-white shadow rounded-md overflow-hidden">
      <img
        src={event.banner || "/default-banner.png"}
        className="w-full h-32 object-cover"
        alt={event.title}
      />

      <div className="p-4">
        <h2 className="font-semibold text-lg">{event.title}</h2>
        <p className="text-gray-500 text-sm">{event.date}</p>

        <Link
          to={`/cafe/events/${event.id}`}
          className="mt-3 block text-blue-600 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
