// src/components/EventForm.jsx
import { useState } from "react";

export default function EventForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      date: "",
      time: "",
      banner: "",
      description: "",
      maxAttendees: "",
    }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-xl space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Event Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border p-2 rounded-md mt-1"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Banner Image URL</label>
        <input
          type="text"
          name="banner"
          value={form.banner}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded-md mt-1"
        ></textarea>
      </div>

      <div>
        <label className="text-sm font-medium">Max Attendees</label>
        <input
          type="number"
          name="maxAttendees"
          value={form.maxAttendees}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
        />
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Save Event
      </button>
    </form>
  );
}
