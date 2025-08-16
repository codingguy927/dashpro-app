// app/settings/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Load saved preferences
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    if (localStorage.getItem("emailNotifs") === "off") {
      setEmailNotifs(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  // Toggle email notifications
  const toggleEmailNotifs = () => {
    setEmailNotifs((prev) => {
      const newState = !prev;
      localStorage.setItem("emailNotifs", newState ? "on" : "off");
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">
          Manage your dashboard preferences here.
        </p>

        {/* Dark Mode */}
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <span className="text-lg font-medium">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-md transition ${
              darkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-600 text-gray-200 hover:bg-gray-500"
            }`}
          >
            {darkMode ? "On" : "Off"}
          </button>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <span className="text-lg font-medium">Email Notifications</span>
          <button
            onClick={toggleEmailNotifs}
            className={`px-4 py-2 rounded-md transition ${
              emailNotifs
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-gray-200 hover:bg-gray-500"
            }`}
          >
            {emailNotifs ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Account</h2>
          <p className="text-gray-200">Lee Mitchell</p>
          <p className="text-gray-400">leemitchell1245@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
