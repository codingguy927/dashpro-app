import Link from 'next/link';
import { Home, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const nav = [
    { href: '/', icon: <Home />, label: 'Overview' },
    { href: '/clients', icon: <Users />, label: 'Clients' },
    { href: '/settings', icon: <Settings />, label: 'Settings' },
  ];
  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-6 space-y-8">
      <h1 className="text-2xl font-bold text-primary">DashPro</h1>
      <ul className="space-y-4">
        {nav.map(item => (
          <li key={item.href}>
            <Link href={item.href} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition">
              {item.icon} <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}