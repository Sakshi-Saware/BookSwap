// src/pages/CafeSettings.jsx
import CafeLayout from "../components/CafeLayout";
import { useState } from "react";

export default function CafeSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    autoApprove: false,
  });

  function toggleSetting(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <CafeLayout>
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-10">
        Settings
      </h1>

      <div className="space-y-10">

        {/* ACCOUNT SETTINGS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Account Settings
          </h2>

          {/* Email */}
          <div className="flex justify-between items-center py-4 border-b">
            <div>
              <p className="font-medium text-gray-800">Email Updates</p>
              <p className="text-gray-500 text-sm">
                Receive important updates about your café.
              </p>
            </div>

            <button
              onClick={() => toggleSetting("emailUpdates")}
              className={`w-14 h-7 rounded-full p-1 flex ${
                settings.emailUpdates ? "bg-blue-500" : "bg-gray-300"
              } transition`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform ${
                  settings.emailUpdates ? "translate-x-7" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center py-4">
            <div>
              <p className="font-medium text-gray-800">Push Notifications</p>
              <p className="text-gray-500 text-sm">
                Get notified about RSVPs, new messages, and updates.
              </p>
            </div>

            <button
              onClick={() => toggleSetting("notifications")}
              className={`w-14 h-7 rounded-full p-1 flex ${
                settings.notifications ? "bg-blue-500" : "bg-gray-300"
              } transition`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform ${
                  settings.notifications ? "translate-x-7" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* EVENT DEFAULTS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Event Preferences
          </h2>

          {/* Auto Approve */}
          <div className="flex justify-between items-center py-4">
            <div>
              <p className="font-medium text-gray-800">Auto-approve Attendees</p>
              <p className="text-gray-500 text-sm">
                Automatically accept people when they sign up.
              </p>
            </div>

            <button
              onClick={() => toggleSetting("autoApprove")}
              className={`w-14 h-7 rounded-full p-1 flex ${
                settings.autoApprove ? "bg-blue-500" : "bg-gray-300"
              } transition`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform ${
                  settings.autoApprove ? "translate-x-7" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* SECURITY */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Security
          </h2>

          <div className="space-y-4">
            <button className="px-6 py-3 bg-gray-200 rounded-xl font-medium shadow hover:bg-gray-300 transition">
              Change Password
            </button>

            <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow hover:bg-red-600 transition">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </CafeLayout>
  );
}
