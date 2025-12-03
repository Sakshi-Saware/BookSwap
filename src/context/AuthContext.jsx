// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import { mock } from "../services/mockService";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------
      🔐 Verification Flags (localStorage)
  ------------------------------------*/
  const getVerificationFlags = (uid) => {
    const map = JSON.parse(localStorage.getItem("verifyFlags") || "{}");
    return map[uid] || { email: false, phone: false, aadhaar: false };
  };

  const setVerificationFlags = (uid, flags) => {
    const map = JSON.parse(localStorage.getItem("verifyFlags") || "{}");
    map[uid] = flags;
    localStorage.setItem("verifyFlags", JSON.stringify(map));
  };

  /* -----------------------------------
      🔥 MAIN AUTH LOGIC
  ------------------------------------*/
  useEffect(() => {
    // 1️⃣ Load mock-user login first (local login)
    const savedUser = localStorage.getItem("books_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      return; // prevent Firebase overriding manual login
    }

    // 2️⃣ Firebase auth listener
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        let mockUser = await mock.getUser(u.uid);

        // ⭐ If Firebase user DOES NOT exist in mock DB → create it safely
        if (!mockUser) {
          mockUser = await mock.addUser({
            uid: u.uid,        // preserve Firebase UID
            name: u.displayName || "Reader",
            email: u.email,
            password: "firebase",
            role: "user",
            location: "",
          });
        }

        const flags = getVerificationFlags(u.uid);

        // Merge Firebase + Mock fields
        const mergedUser = {
          uid: u.uid,
          displayName: mockUser.name || u.displayName || "Reader",
          email: u.email,
          photoURL: mockUser.photo || u.photoURL,
          phoneNumber: mockUser.phone || u.phoneNumber,
          verified: flags,
          role: mockUser.role || "user",
        };

        setUser(mergedUser);
        localStorage.setItem("books_user", JSON.stringify(mergedUser));
      } else {
        setUser(null);
        localStorage.removeItem("books_user");
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  /* -----------------------------------
      🔑 signIn() – for mock.authenticate()
  ------------------------------------*/
  function signIn(mockUser) {
    setUser(mockUser);
    localStorage.setItem("books_user", JSON.stringify(mockUser));
  }

  /* -----------------------------------
      🚪 signOut()
  ------------------------------------*/
  async function signOut() {
    try {
      await fbSignOut(auth);
    } catch (_) {}

    setUser(null);
    localStorage.removeItem("books_user");
  }

  /* -----------------------------------
      📝 updateUserProfile()
  ------------------------------------*/
  async function updateUserProfile(patch) {
    if (!user?.uid) return Promise.reject("Not logged in");

    const updated = await mock.updateUser(user.uid, patch);

    const merged = { ...user, ...updated };
    setUser(merged);

    localStorage.setItem("books_user", JSON.stringify(merged));

    return merged;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUserProfile,
        setVerificationFlags,
        getVerificationFlags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
