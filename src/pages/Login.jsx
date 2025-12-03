// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mock } from "../services/mockService"; 
import { mockCafeAuth } from "../services/mockCafeServices";
import { useAuth } from "../context/AuthContext";           
import { useCafeAuth } from "../context/CafeAuthContext";   

export default function Login() {
  const nav = useNavigate();

  const { signIn: userSignIn } = useAuth();
  const { login: cafeLogin } = useCafeAuth();

  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        const u = await mock.authenticate(form.email, form.password, "user");
        await userSignIn(u);
        alert("User Login successful!");
        nav("/");
      } else if (role === "cafe") {
        const result = await mockCafeAuth.login(form.email, form.password);

        if (!result.success) {
          alert(result.message);
          return;
        }

        await cafeLogin(result.cafe);
        alert("Café Login successful!");
        nav("/cafe/dashboard");
      }
    } catch (err) {
      alert("Login failed: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Log In</h2>

        {/* Select Role */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 px-3 py-2 rounded ${
              role === "user"
                ? "bg-[var(--btn)] text-white"
                : "border border-gray-300"
            }`}
          >
            User
          </button>

          <button
            type="button"
            onClick={() => setRole("cafe")}
            className={`flex-1 px-3 py-2 rounded ${
              role === "cafe"
                ? "bg-[var(--btn)] text-white"
                : "border border-gray-300"
            }`}
          >
            Café
          </button>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--btn)]"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--btn)]"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--btn)] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Links */}
        <div className="flex justify-between text-sm mt-2">
          <button
            type="button"
            onClick={() => nav("/signup")}
            className="text-[var(--btn)] hover:underline"
          >
            Create User Account
          </button>

          <button
            type="button"
            onClick={() => nav("/signup-cafe")}
            className="text-[var(--btn)] hover:underline"
          >
            Register Café
          </button>
        </div>
      </form>
    </div>
  );
}
