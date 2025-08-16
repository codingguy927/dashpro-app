"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/clients", icon: <Users className="w-5 h-5" />, label: "Clients" },
    { href: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <aside className="w-60 bg-gray-800 p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">🚀 DashPro</h1>
      <nav className="flex flex-col gap-2">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
