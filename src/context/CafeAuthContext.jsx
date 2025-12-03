// src/context/CafeAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { mockCafeAuth } from "../services/mockCafeServices";

const CafeAuthContext = createContext();

export function CafeAuthProvider({ children }) {
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved cafe data (persistent login)
  useEffect(() => {
    const saved = localStorage.getItem("cafe");
    if (saved) setCafe(JSON.parse(saved));
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await mockCafeAuth.login(email, password);
    if (res.success) {
      setCafe(res.cafe);
      localStorage.setItem("cafe", JSON.stringify(res.cafe));
    }
    return res;
  };

  // LOGOUT
  const logout = () => {
    setCafe(null);
    localStorage.removeItem("cafe");
  };

  // UPDATE CAFE PROFILE (IMPORTANT)
  const updateCafe = (updatedCafe) => {
    setCafe(updatedCafe);
    localStorage.setItem("cafe", JSON.stringify(updatedCafe));
  };

  return (
    <CafeAuthContext.Provider
      value={{ cafe, login, logout, updateCafe, loading }}
    >
      {children}
    </CafeAuthContext.Provider>
  );
}

export const useCafeAuth = () => useContext(CafeAuthContext);
