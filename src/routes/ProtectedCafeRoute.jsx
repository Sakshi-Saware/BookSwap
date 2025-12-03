// src/routes/ProtectedCafeRoute.jsx
import { Navigate } from "react-router-dom";
import { useCafeAuth } from "../context/CafeAuthContext";

export default function ProtectedCafeRoute({ children }) {
  const { cafe, loading } = useCafeAuth();

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  // Redirect if not logged in
  if (!cafe) return <Navigate to="/login" replace />;

  return children;
}
