// components/ThemeToggle.jsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // next-themes doesn’t know the theme on first render—avoid flicker:
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // use `resolvedTheme` so we respect system if you ever enable that
  const current = resolvedTheme; // will be "light" or "dark"

  return (
    <button
      onClick={() => setTheme(current === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {current === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
