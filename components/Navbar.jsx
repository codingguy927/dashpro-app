"use client";
import ThemeToggle from './ThemeToggle';
import { Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Bell className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">John Doe</span>
        <button className="px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary-dark transition">
          Sign Out
        </button>
      </div>
    </header>
  );
}