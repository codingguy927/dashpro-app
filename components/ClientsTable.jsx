// components/ClientsTable.jsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { format, differenceInDays } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ClientTasksModal from "./ClientTasksModal";

export default function ClientsTable({ clients, onUpdateClient }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalTask, setModalTask] = useState(null);
  const rowsPerPage = 5;

  // Clear reminder timeouts on unmount
  const reminderTimeouts = useRef([]);
  useEffect(() => () => reminderTimeouts.current.forEach(clearTimeout), []);

  // 1️⃣ Filter
  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  // 2️⃣ Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  // 3️⃣ Paginate
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page]);

  // Select‐all state
  const allOnPage = paginated.every((c) => selected.has(c.id));
  const someOnPage = paginated.some((c) => selected.has(c.id));

  // Sortable header helper
  const header = (label, field) => (
    <th
      onClick={() => {
        if (sortField === field) setSortAsc((asc) => !asc);
        else {
          setSortField(field);
          setSortAsc(true);
        }
        setPage(1);
      }}
      className="cursor-pointer select-none text-left"
    >
      {label} {sortField === field && (sortAsc ? "▲" : "▼")}
    </th>
  );

  // Bulk delete
  const deleteSelected = () => {
    onUpdateClient((all) => all.filter((c) => !selected.has(c.id)));
    setSelected(new Set());
  };

  // Bulk export
  const exportSelected = () => {
    const rows = clients.filter((c) => selected.has(c.id));
    const head = ["id", "name", "email", "status", "priority", "due"];
    const lines = [
      head.join(","),
      ...rows.map((r) =>
        [
          r.id,
          `"${r.name.replace(/"/g, '""')}"`,
          `"${r.email.replace(/"/g, '""')}"`,
          r.status,
          r.priority,
          r.due,
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col">
      {/* Search + Bulk Actions */}
      <div className="flex flex-wrap items-center mb-4 space-x-2">
        <Search className="text-gray-400" />
        <input
          type="text"
          className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {selected.size > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={exportSelected}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export {selected.size} CSV
            </button>
            <button
              onClick={deleteSelected}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete {selected.size}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <tr className="text-gray-500 dark:text-gray-400">
              <th className="pl-2">
                <input
                  type="checkbox"
                  aria-label="Select all clients on page"
                  checked={allOnPage}
                  ref={(el) =>
                    el && (el.indeterminate = !allOnPage && someOnPage)
                  }
                  onChange={(e) => {
                    const next = new Set(selected);
                    if (e.target.checked) paginated.forEach((c) => next.add(c.id));
                    else paginated.forEach((c) => next.delete(c.id));
                    setSelected(next);
                  }}
                />
              </th>
              {header("Name", "name")}
              {header("Email", "email")}
              <th>Status</th>
              <th className="hidden md:table-cell">Priority</th>
              <th className="hidden lg:table-cell">Deadline</th>
              <th className="hidden lg:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => {
              const daysLeft = differenceInDays(new Date(c.due), new Date());
              const dueClass =
                daysLeft <= 3
                  ? "text-red-500"
                  : daysLeft <= 7
                  ? "text-yellow-400"
                  : "text-green-500";
              const priorityColor = {
                High: "bg-red-100 text-red-600",
                Medium: "bg-yellow-100 text-yellow-600",
                Low: "bg-green-100 text-green-600",
              }[c.priority];

              return (
                <tr
                  key={c.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="pl-2">
                    <input
                      type="checkbox"
                      aria-label={`Select client ${c.name}`}
                      checked={selected.has(c.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(c.id);
                        else next.delete(c.id);
                        setSelected(next);
                      }}
                    />
                  </td>
                  <td className="py-2">{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
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
                      {format(new Date(c.due), "MMM d, yyyy")}
                    </span>
                    <button
                      disabled={new Date(c.due) <= Date.now()}
                      className="px-2 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
                      onClick={() => {
                        const msUntil = new Date(c.due) - Date.now();
                        const id = setTimeout(() => {
                          alert(`🔔 Reminder: “${c.name}”’s task is due today!`);
                        }, msUntil);
                        reminderTimeouts.current.push(id);
                        alert("✅ Reminder set!");
                      }}
                    >
                      Remind me
                    </button>
                    <button
                      className="px-2 py-1 text-sm bg-indigo-100 rounded hover:bg-indigo-200"
                      onClick={() => setModalTask(c)}
                    >
                      Edit
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
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Edit Task Modal */}
      {modalTask && (
        <ClientTasksModal
          task={modalTask}
          onSave={(edited) => {
            onUpdateClient((all) =>
              all.map((c) => (c.id === edited.id ? edited : c))
            );
            setModalTask(null);
          }}
          onClose={() => setModalTask(null)}
        />
      )}
    </div>
  );
}
