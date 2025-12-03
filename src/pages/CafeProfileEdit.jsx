// src/pages/CafeProfileEdit.jsx
import CafeLayout from "../components/CafeLayout";
import { useCafeAuth } from "../context/CafeAuthContext";
import { useState } from "react";

export default function CafeProfileEdit() {
  const { cafe, updateCafe } = useCafeAuth();
  const [editMode, setEditMode] = useState(false);

  const [logoPreview, setLogoPreview] = useState(cafe?.logo || "/default-cafe.png");
  const [logoFile, setLogoFile] = useState(null);

  // Initial Form Data
  const [form, setForm] = useState({
    name: cafe?.name || "",
    ownerName: cafe?.ownerName || "",
    description: cafe?.description || "",
    phone: cafe?.phone || "",
    street: cafe?.address?.street || "",
    city: cafe?.address?.city || "",
    pincode: cafe?.address?.pincode || "",
    instagram: cafe?.instagram || "",
    hoursFrom: cafe?.hours?.from || "",
    hoursTo: cafe?.hours?.to || "",
  });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Handle LOGO Upload
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file); // convert to Base64
  }

  // SAVE PROFILE
  function saveProfile() {
    // REQUIRED FIELDS CHECK
    if (
      !form.name.trim() ||
      !form.ownerName.trim() ||
      !form.description.trim() ||
      !form.phone.trim() ||
      !form.street.trim() ||
      !form.city.trim() ||
      !form.pincode.trim() ||
      !form.hoursFrom ||
      !form.hoursTo
    ) {
      alert("All fields are required.");
      return;
    }

    const updatedCafe = {
      ...cafe,
      name: form.name,
      ownerName: form.ownerName,
      description: form.description,
      phone: form.phone,
      instagram: form.instagram,
      logo: logoPreview, // updated logo BASE64

      address: {
        street: form.street,
        city: form.city,
        pincode: form.pincode,
      },

      hours: {
        from: form.hoursFrom,
        to: form.hoursTo,
      },
    };

    updateCafe(updatedCafe); // persist + update state instantly
    alert("Profile updated!");
    setEditMode(false);
  }

  return (
    <CafeLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Café Profile
        </h1>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow hover:bg-[#3a78c0]"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* VIEW MODE */}
        {!editMode && (
          <div className="space-y-8">

            {/* Logo + Name */}
            <div className="flex items-center gap-6">
              <img
                src={cafe?.logo || "/default-cafe.png"}
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {cafe?.name}
                </h2>
                <p className="text-gray-500 text-sm">Owned by: {cafe?.ownerName}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {cafe?.description || "No description added."}
              </p>
            </div>

            {/* Contact + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone</p>
                <p className="text-gray-800 font-medium">{cafe?.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Instagram</p>
                <p className="text-gray-800 font-medium">@{cafe?.instagram}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 font-medium">Address</p>
                <p className="text-gray-800 font-medium">
                  {cafe?.address?.street}, {cafe?.address?.city} - {cafe?.address?.pincode}
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Opening Hours</h3>
              <p className="text-gray-700">
                {cafe?.hours?.from} – {cafe?.hours?.to}
              </p>
            </div>

          </div>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div className="space-y-8">

            {/* Logo Upload */}
            <div className="flex items-center gap-6">
              <img
                src={logoPreview}
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
              <div>
                <label className="cursor-pointer text-sm font-medium text-blue-600">
                  Change Logo
                  <input type="file" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            {/* Editable Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Café Name *</p>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* Owner Name */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Owner Name *</p>
                <input
                  value={form.ownerName}
                  onChange={(e) => setField("ownerName", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 font-medium">Description *</p>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                ></textarea>
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone *</p>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* Instagram */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Instagram *</p>
                <input
                  value={form.instagram}
                  onChange={(e) => setField("instagram", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"

                />
              </div>

              {/* Street */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Street *</p>
                <input
                  value={form.street}
                  onChange={(e) => setField("street", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* City */}
              <div>
                <p className="text-sm text-gray-500 font-medium">City *</p>
                <input
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* Pincode */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Pincode *</p>
                <input
                  value={form.pincode}
                  onChange={(e) => setField("pincode", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              {/* Hours */}
              <div>
                <p className="text-sm text-gray-500 font-medium">Open From *</p>
                <input
                  type="time"
                  value={form.hoursFrom}
                  onChange={(e) => setField("hoursFrom", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Open To *</p>
                <input
                  type="time"
                  value={form.hoursTo}
                  onChange={(e) => setField("hoursTo", e.target.value)}
                  className="w-full border p-3 rounded-xl mt-1"
                  required
                />
              </div>

            </div>

            {/* Save Button */}
            <button
              onClick={saveProfile}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
            >
              Save Profile
            </button>
          </div>
        )}

      </div>
    </CafeLayout>
  );
}
