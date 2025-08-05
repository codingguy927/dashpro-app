"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { format, differenceInDays } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ClientTasksModal from "./ClientTasksModal";
import toast from "react-hot-toast";
import StatsCard from "./StatsCard";
import { Users, Calendar, AlertCircle, Clock } from "lucide-react";

export default function ClientsTable({ clients, onUpdateClient }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalTask, setModalTask] = useState(null);
  const rowsPerPage = 5;
  const reminderTimeouts = useRef([]);

  useEffect(() => {
    const soonDueClients = clients.filter((c) => {
      const daysLeft = differenceInDays(new Date(c.due), new Date());
      return daysLeft >= 0 && daysLeft <= 3;
    });

    soonDueClients.forEach((c) => {
      toast(`🔔 “${c.name}” has a task due in ${differenceInDays(new Date(c.due), new Date())} day(s)!`);
    });

    return () => {
      reminderTimeouts.current.forEach(clearTimeout);
    };
  }, [clients]);

  const filtered = useMemo(
    () =>
      clients.map((c) => ({
        ...c,
        avatarUrl: c.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}`,
      })).filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page]);
  const allOnPage = paginated.every((c) => selected.has(c.id));
  const someOnPage = paginated.some((c) => selected.has(c.id));

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

  const deleteSelected = () => {
    onUpdateClient((all) => all.filter((c) => !selected.has(c.id)));
    setSelected(new Set());
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={Users}
          label="Total Clients"
          value={clients.length}
          color={{ bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-900 dark:text-blue-100" }}
        />
        <StatsCard
          icon={Calendar}
          label="Tasks Due Today"
          value={clients.filter(c => differenceInDays(new Date(c.due), new Date()) === 0).length}
          color={{ bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-900 dark:text-yellow-100" }}
        />
        <StatsCard
          icon={AlertCircle}
          label="Overdue Tasks"
          value={clients.filter(c => differenceInDays(new Date(c.due), new Date()) < 0).length}
          color={{ bg: "bg-red-100 dark:bg-red-900", text: "text-red-900 dark:text-red-100" }}
        />
        <StatsCard
          icon={Clock}
          label="Upcoming (3 days)"
          value={clients.filter(c => {
            const d = differenceInDays(new Date(c.due), new Date());
            return d > 0 && d <= 3;
          }).length}
          color={{ bg: "bg-green-100 dark:bg-green-900", text: "text-green-900 dark:text-green-100" }}
        />
      </div>

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
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <tr className="text-gray-500 dark:text-gray-400">
              <th className="pl-2"></th>
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
              return (
                <tr key={c.id}>
                  <td className="pl-2">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(c.id);
                        else next.delete(c.id);
                        setSelected(next);
                      }}
                    />
                  </td>
                  <td className="py-2 flex items-center space-x-3">
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{c.name}</span>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.status}</td>
                  <td className="hidden md:table-cell">{c.priority}</td>
                  <td className="hidden lg:table-cell">{format(new Date(c.due), "MMM d, yyyy")}</td>
                  <td className="hidden lg:table-cell">
                    <button
                      onClick={() => setModalTask(c)}
                      className="px-2 py-1 text-sm bg-indigo-100 rounded hover:bg-indigo-200"
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
