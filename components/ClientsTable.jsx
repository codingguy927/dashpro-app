"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ClientsTable({ clients }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Track reminder timeouts to clear them on unmount
  const reminderTimeouts = useRef([]);
  useEffect(() => {
    return () => {
      reminderTimeouts.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // 1. Filter
  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  // 2. Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  // 3. Paginate
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page]);

  // Helper to render sortable headers
  const header = (label, field) => (
    <th
      onClick={() => {
        if (sortField === field) {
          setSortAsc(!sortAsc);
        } else {
          setSortField(field);
          setSortAsc(true);
        }
        setPage(1);
      }}
      className="cursor-pointer text-left"
    >
      {label} {sortField === field && (sortAsc ? '▲' : '▼')}
    </th>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col">
      {/* Search input */}
      <div className="flex items-center mb-4">
        <Search className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <tr className="text-gray-500 dark:text-gray-400">
              {header('Name', 'name')}
              {header('Email', 'email')}
              <th>Status</th>
              <th className="hidden md:table-cell">Priority</th>
              <th className="hidden lg:table-cell">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => {
              const daysLeft = differenceInDays(new Date(c.due), new Date());
              const dueClass =
                daysLeft <= 3
                  ? 'text-red-500'
                  : daysLeft <= 7
                  ? 'text-yellow-400'
                  : 'text-green-500';
              const priorityColor = {
                High: 'bg-red-100 text-red-600',
                Medium: 'bg-yellow-100 text-yellow-600',
                Low: 'bg-green-100 text-green-600',
              }[c.priority];

              return (
                <tr
                  key={c.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-2">{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        c.status === 'Active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${priorityColor}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-2 hidden lg:table-cell flex items-center space-x-2">
                    <span className={dueClass}>
                      {format(new Date(c.due), 'MMM d, yyyy')}
                    </span>
                    <button
                      className="text-sm px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
                      disabled={new Date(c.due) <= Date.now()}
                      onClick={() => {
                        const msUntil = new Date(c.due) - Date.now();
                        const id = setTimeout(() => {
                          alert(`🔔 Reminder: “${c.name}”’s task is due today!`);
                        }, msUntil);
                        reminderTimeouts.current.push(id);
                        alert('✅ Reminder set for due date!');
                      }}
                    >
                      Remind me
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="p-2 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`
                px-3 py-1 rounded
                ${
                  page === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
