// src/components/CafeSidebar.jsx
import { NavLink } from "react-router-dom";

export default function CafeSidebar() {
  const navItems = [
    { name: "Dashboard", to: "/cafe/dashboard" },
    { name: "Events", to: "/cafe/events" },
    { name: "Messages", to: "/cafe/messages" },
    { name: "Settings", to: "/cafe/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#faf7f2] p-6 border-r border-[#eae6df] overflow-y-auto
">

      {/* SIDEBAR HEADER (optional) */}
      <div className="mt-20 mb-6 px-2">
        <p className="text-sm font-semibold text-gray-500 tracking-wide">
          NAVIGATION
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                px-4 py-3 rounded-xl font-medium transition
                ${
                  isActive
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-700 hover:bg-white/70 hover:text-gray-900"
                }
              `
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
