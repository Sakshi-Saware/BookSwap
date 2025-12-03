// src/components/AttendeeList.jsx
export default function AttendeeList({ attendees }) {
  if (!attendees || attendees.length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-center text-gray-500 rounded-md">
        No attendees yet.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-md divide-y">
      {attendees.map((user) => (
        <div key={user.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.photo || "/default-user.png"}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <span
            className={`text-sm font-medium px-3 py-1 rounded-md ${
              user.status === "approved"
                ? "bg-green-100 text-green-700"
                : user.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status}
          </span>
        </div>
      ))}
    </div>
  );
}
