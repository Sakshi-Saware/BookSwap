// src/pages/SignupUser.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import FileUpload from "../components/FileUpload";
import GenreTags from "../components/GenreTags";
import { mock } from "../services/mockService";

export default function SignupUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", phone: "", city: "", bio: "", genres: []
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    // validation
    if (!form.name || !form.email || !form.password) return alert("Please fill required fields");
    if (form.password.length < 6) return alert("Password too short (min 6)");
    if (form.password !== form.confirm) return alert("Passwords do not match");

    setLoading(true);
    try {
      const user = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        avatar,
        bio: form.bio,
        favoriteGenres: form.genres
      };
      await mock.addUser(user);
      alert("Account created. Please log in.");
      nav("/login");
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="max-w-xl w-full bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Create your BookSwap Account</h2>

        <FormInput label="Full name">
          <input value={form.name} onChange={e => setField("name", e.target.value)} className="w-full border p-2 rounded" />
        </FormInput>

        <FormInput label="Email address">
          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} className="w-full border p-2 rounded" />
        </FormInput>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Password">
            <PasswordInput id="pwd" value={form.password} onChange={e => setField("password", e.target.value)} />
          </FormInput>
          <FormInput label="Confirm password">
            <PasswordInput id="pwd2" value={form.confirm} onChange={e => setField("confirm", e.target.value)} />
          </FormInput>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Phone (optional)">
            <input value={form.phone} onChange={e => setField("phone", e.target.value)} className="w-full border p-2 rounded" />
          </FormInput>
          <FormInput label="City / Location">
            <input value={form.city} onChange={e => setField("city", e.target.value)} className="w-full border p-2 rounded" />
          </FormInput>
        </div>

        <FormInput label="Profile picture (optional)">
          <FileUpload onChange={setAvatar} />
        </FormInput>

        <FormInput label="Favourite genres">
          <GenreTags value={form.genres} onChange={v => setField("genres", v)} suggestions={["Romance","Fantasy","Mystery","Sci-Fi","Self-Help"]} />
        </FormInput>

        <FormInput label="Short bio">
          <textarea value={form.bio} onChange={e => setField("bio", e.target.value)} className="w-full border p-2 rounded" />
        </FormInput>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[var(--btn)] text-white rounded">
            {loading ? "Creating..." : "Create Account"}
          </button>
          <div className="text-sm">
            Already have an account? <button type="button" onClick={() => nav("/login")} className="text-[var(--btn)]">Log in</button>
          </div>
        </div>
      </form>
    </div>
  );
}
