// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Search from "../pages/Search";
import BookDetails from "../pages/BookDetails";
import Profile from "../pages/Profile";
import MyBookshelf from "../pages/MyBookshelf";
import Requests from "../pages/Requests";
import Chats from "../pages/Chats";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Navbar from "../components/Navbar";
import Wishlist from "../pages/Wishlist";
import Peers from "../pages/Peers";
import UserProfile from "../pages/UserProfile";
import SignupUser from "../pages/SignupUser";
import SignupCafe from "../pages/SignupCafe";
import EditProfile from "../pages/EditProfile";
import Notifications from "../pages/Notifications";
import Community from "../pages/Community";
import EventDetails from "../pages/EventDetails";

import CafeDashboard from "../pages/CafeDashboard";
import CafeEvents from "../pages/CafeEvents";
import CafeEventDetails from "../pages/CafeEventDetails";
import CafeCreateEvent from "../pages/CafeCreateEvent";
import CafeEditEvent from "../pages/CafeEditEvent";
import CafeMessages from "../pages/CafeMessages";
import CafeSettings from "../pages/CafeSettings"
import CafeProfileEdit from "../pages/CafeProfileEdit";

function AppRoutesContent() {
  const location = useLocation();

  // hide navbar on café routes
  const hideNavbar = location.pathname.startsWith("/cafe");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="pb-20">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* Book Details */}
          <Route path="/book/:id" element={<BookDetails />} />

          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:uid" element={<UserProfile />} />

          {/* Bookshelf */}
          <Route path="/mybooks" element={<MyBookshelf />} />

          {/* Requests */}
          <Route path="/requests" element={<Requests />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Peers & Chats */}
          <Route path="/peers" element={<Peers />} />
          <Route path="/chats" element={<Chats />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-user" element={<SignupUser />} />
          <Route path="/signup-cafe" element={<SignupCafe />} />

          {/* Edit Profile */}
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Community & Events */}
          <Route path="/community" element={<Community />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Café Dashboard Pages */}
          <Route path="/cafe/dashboard" element={<CafeDashboard />} />
          <Route path="/cafe/events" element={<CafeEvents />} />
          <Route path="/cafe/events/new" element={<CafeCreateEvent />} />
          <Route path="/cafe/events/:eventId" element={<CafeEventDetails />} />
          <Route path="/cafe/events/:eventId/edit" element={<CafeEditEvent />} />
          <Route path="/cafe/messages" element={<CafeMessages />} />
          <Route path="/cafe/settings" element={<CafeSettings />} />
          <Route path="/cafe/profile/edit" element={<CafeProfileEdit />} />
        </Routes>
      </div>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
}
