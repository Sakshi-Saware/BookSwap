// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mock } from "../services/mockService";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Dropdowns
  const [browseOpen, setBrowseOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notifications
  const [unreadCount, setUnreadCount] = useState(0);

  // Debounce timers
  const browseTimer = useRef(null);
  const communityTimer = useRef(null);
  const profileTimer = useRef(null);

  // Smooth open/close animation helpers
  const openMenu = (setFn, timer) => {
    clearTimeout(timer.current);
    setFn(true);
  };
  const closeMenu = (setFn, timer) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFn(false), 200);
  };

  // Genres
  const GENRES = [
    "Literary Fiction", "Romance", "Mystery", "Thriller", "Horror",
    "Science Fiction", "Fantasy", "Historical Fiction", "Adventure",
    "Dystopian", "Young Adult", "Drama", "Crime", "Humor", "Self-Help",
    "Biography", "Psychology", "Philosophy", "Business", "History",
    "Science", "Travel", "Art", "Cooking"
  ];

  const goGenre = (g) => {
    navigate(`/search?genre=${encodeURIComponent(g)}`);
    setBrowseOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    async function loadUnread() {
      if (!user) {
        setUnreadCount(0);
        return;
      }
      try {
        const list = await mock.listNotifications(user.uid);
        setUnreadCount(list.filter(n => !n.seen).length);
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    }
    loadUnread();
    // refresh when user changes
  }, [user, pathname]);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setBrowseOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const avatarSrc = user?.photoURL || user?.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-[var(--text)] hover:text-[var(--btn)] transition">
            📚 BookSwap
          </Link>

          {/* Desktop: Browse */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => openMenu(setBrowseOpen, browseTimer)}
            onMouseLeave={() => closeMenu(setBrowseOpen, browseTimer)}
          >
            <button className="hover:text-[var(--btn)] font-medium px-2 py-1">Browse ▼</button>

            {browseOpen && (
              <div className="absolute left-0 top-full mt-2 bg-white border shadow-lg p-4 rounded-lg w-[620px]">
                <h4 className="font-semibold mb-2 text-gray-700">Genres</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => goGenre(g)}
                      className="text-left w-full hover:text-[var(--btn)] transition px-1 py-0.5"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Community */}
          <div className="relative hidden md:block">
            <Link to="/community" className="hover:text-[var(--btn)] font-medium px-2 py-1">Community</Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Primary links (hidden on small) */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/" className={`hover:text-[var(--btn)] ${pathname === "/" ? "font-semibold text-[var(--btn)]" : ""}`}>Home</Link>
            <Link to="/search" className={`hover:text-[var(--btn)] ${pathname.startsWith("/search") ? "font-semibold text-[var(--btn)]" : ""}`}>Search</Link>
          </div>

          {/* Auth buttons / icons */}
          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-3 py-1 rounded-md border text-[var(--btn)] hover:bg-[var(--btn)] hover:text-white transition">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded-md bg-[var(--btn)] text-white hover:opacity-90 transition">Sign Up</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Bell / Notifications */}
              <button
                title="Notifications"
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile avatar + dropdown */}
              <div
                className="relative"
                onMouseEnter={() => openMenu(setProfileOpen, profileTimer)}
                onMouseLeave={() => closeMenu(setProfileOpen, profileTimer)}
              >
                <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition">
                  <img src={avatarSrc} alt="me" className="w-8 h-8 rounded-full object-cover border" />
                  <span className="hidden sm:inline font-medium">Profile ▾</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border shadow-lg rounded-lg w-56 text-sm z-50">
                    <div className="p-3 border-b flex items-center gap-3">
                      <img src={avatarSrc} alt="me" className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <div className="font-medium">{user.displayName || user.name || "You"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>

                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/mybooks" className="block px-4 py-2 hover:bg-gray-100">My Bookshelf</Link>
                    <Link to="/requests" className="block px-4 py-2 hover:bg-gray-100">Requests</Link>
                    <Link to="/peers" className="block px-4 py-2 hover:bg-gray-100">💬 Peers</Link>

                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block">Home</Link>
            <Link to="/search" onClick={() => setMobileOpen(false)} className="block">Search</Link>
            <div className="block">
              <div className="font-medium mt-2">Genres</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {GENRES.slice(0, 8).map(g => (
                  <button key={g} onClick={() => goGenre(g)} className="text-left text-sm px-1 py-1 rounded hover:bg-gray-100">{g}</button>
                ))}
                <Link to="/search" onClick={() => setMobileOpen(false)} className="text-sm px-1 py-1 rounded hover:bg-gray-100">See all genres</Link>
              </div>
            </div>

            <Link to="/community" onClick={() => setMobileOpen(false)} className="block">Community</Link>

            {!user ? (
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="flex-1 px-3 py-2 border text-center">Login</Link>
                <Link to="/signup" className="flex-1 px-3 py-2 bg-[var(--btn)] text-white text-center rounded">Sign Up</Link>
              </div>
            ) : (
              <>
                <button onClick={() => { navigate("/notifications"); setMobileOpen(false); }} className="w-full text-left px-3 py-2">🔔 Notifications {unreadCount>0 && <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>}</button>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2">Profile</Link>
                <Link to="/mybooks" onClick={() => setMobileOpen(false)} className="block px-3 py-2">My Bookshelf</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 text-red-600">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
