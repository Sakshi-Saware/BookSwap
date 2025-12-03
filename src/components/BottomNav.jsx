import React from "react";
import { Link } from "react-router-dom";
export default function BottomNav(){
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
      <Link to="/">Home</Link>
      <Link to="/mybooks">My Bookshelf</Link>
      <Link to="/search">Search</Link>
      <Link to="/requests">Requests</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}
