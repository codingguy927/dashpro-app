import "./globals.css";
import Link from "next/link";
import { Users, LayoutDashboard, Settings } from "lucide-react";
import { Providers } from "./providers";   // 👈 use client wrapper

export const metadata = {
  title: "DashPro",
  description: "Client Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex bg-gray-900 text-white min-h-screen">
        <Providers>
          {/* Sidebar */}
          <aside className="w-60 bg-gray-800 p-6 flex flex-col gap-6">
            <h1 className="text-xl font-bold">🚀 DashPro</h1>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/clients"
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded transition"
              >
                <Users className="w-5 h-5" />
                Clients
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded transition"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
