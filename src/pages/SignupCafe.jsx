// src/pages/SignupCafe.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import FileUpload from "../components/FileUpload";
import { mockCafeAuth } from "../services/mockCafeServices";

export default function SignupCafe() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    cafeName: "",
    ownerName: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    desc: "",
    hoursFrom: "",
    hoursTo: "",
    insta: "",
  });

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.cafeName || !form.email || !form.password)
      return alert("Please fill required fields");

    if (form.password.length < 6)
      return alert("Password should be at least 6 characters");

    if (form.password !== form.confirm)
      return alert("Passwords do not match");

    setLoading(true);
    try {
      const cafeData = {
        name: form.cafeName,
        ownerName: form.ownerName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          pincode: form.pincode,
        },
        description: form.desc,
        logo,
        hours: {
          from: form.hoursFrom,
          to: form.hoursTo,
        },
        instagram: form.insta,
      };

      const result = await mockCafeAuth.register(cafeData);

      if (!result.success) {
        alert(result.message);
      } else {
        alert("Café registered! You can now log in.");
        nav("/login");
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="max-w-2xl w-full bg-white p-6 rounded-lg shadow space-y-3"
      >
        <h2 className="text-xl font-bold">Register Your Café on BookSwap</h2>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Café name">
            <input
              value={form.cafeName}
              onChange={(e) => setField("cafeName", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </FormInput>

          <FormInput label="Owner / Manager">
            <input
              value={form.ownerName}
              onChange={(e) => setField("ownerName", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </FormInput>
        </div>

        <FormInput label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </FormInput>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Password">
            <PasswordInput
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />
          </FormInput>
          <FormInput label="Confirm Password">
            <PasswordInput
              value={form.confirm}
              onChange={(e) => setField("confirm", e.target.value)}
            />
          </FormInput>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </FormInput>
          <FormInput label="Pincode">
            <input
              value={form.pincode}
              onChange={(e) => setField("pincode", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </FormInput>
        </div>

        <FormInput label="Street">
          <input
            value={form.street}
            onChange={(e) => setField("street", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </FormInput>

        <FormInput label="City">
          <input
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </FormInput>

        <FormInput label="Café Description">
          <textarea
            value={form.desc}
            onChange={(e) => setField("desc", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </FormInput>

        <FormInput label="Logo / Café image">
          <FileUpload onChange={setLogo} />
        </FormInput>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[var(--btn)] text-white rounded"
          >
            {loading ? "Registering..." : "Create Café Account"}
          </button>

          <div className="text-sm">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => nav("/login")}
              className="text-[var(--btn)]"
            >
              Log in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
