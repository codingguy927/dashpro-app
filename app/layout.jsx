import './globals.css';
import Providers from '../components/Providers';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'DashPro',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
