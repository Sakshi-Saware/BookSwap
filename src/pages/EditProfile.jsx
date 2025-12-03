// src/pages/EditProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { mock } from "../services/mockService";

export default function EditProfile() {
  const { user, updateUserProfile } = useAuth();   // ✅ FIX
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    genres: [],
  });

  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  // ⭐ Predefined Genres
  const GENRES = [
    "Romance", "Fanfiction", "Fantasy", "Mystery", "Thriller",
    "Horror", "Historical Fiction", "Poetry", "Self-Help",
    "Philosophy", "Drama", "Sci-Fi", "Adventure",
    "Young Adult", "Crime", "Biography", "LGBTQ+"
  ];

  // Load user data
  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }

    async function load() {
      const u = await mock.getUser(user.uid);

      if (u) {
        setForm({
          name: u.name || "",
          email: user.email || "",
          phone: u.phone || "",
          location: u.location || "",
          bio: u.bio || "",
          genres: u.genres || [],
        });
        setPreview(u.photo || null);
      }
    }
    load();
  }, [user]);

  // Handle text changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  // Toggle genre selection
  function toggleGenre(genre) {
    setForm((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      };
    });
  }

  // Upload profile picture
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  // Save updated profile
  async function save() {
    const updated = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      genres: form.genres,
      photo: preview,
    };

    try {
      // ⭐ SUPER IMPORTANT FIX
      await updateUserProfile(updated);

      alert("Profile updated successfully!");
      nav("/profile");

    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => nav(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-semibold mb-6">Edit Profile</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Avatar */}
        <div>
          <label className="font-medium">Profile Picture</label>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={preview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input type="file" ref={fileRef} onChange={handleFile} />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="font-medium">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Your Name"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="font-medium">Email</label>
          <input
            value={form.email}
            disabled
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="font-medium">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="00000 00000"
          />
        </div>

        {/* Location */}
        <div>
          <label className="font-medium">City / Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Your city"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="font-medium">Short Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Tell something about yourself..."
          />
        </div>

        {/* Genres */}
        <div>
          <label className="font-medium">Favourite Genres</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {GENRES.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-2 py-1 rounded text-sm border ${
                  form.genres.includes(g)
                    ? "bg-[var(--btn)] text-white"
                    : "bg-gray-100"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={save}
          className="w-full py-3 bg-[var(--btn)] text-white rounded-lg hover:opacity-90 shadow"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
