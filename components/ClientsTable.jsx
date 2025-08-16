"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pencil, Trash2, Filter, UserPlus, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import ClientDetailPanel from "./ClientDetailPanel";
import { toCsv } from "@/utils/exportCsv"; // ✅ assumes you already have this

// --- Utils ---
function getDueStatus(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due Today";
  if (diff <= 3) return `Due in ${diff}d`;
  return null;
}

function sortClients(clients, sortKey, sortDir) {
  return [...clients].sort((a, b) => {
    let res = 0;
    if (sortKey === "name") res = a.name.localeCompare(b.name);
    if (sortKey === "tasks") {
      const pctA = a.tasks?.filter((t) => t.completed).length / (a.tasks?.length || 1);
      const pctB = b.tasks?.filter((t) => t.completed).length / (b.tasks?.length || 1);
      res = pctB - pctA;
    }
    if (sortKey === "due") {
      const nextA = Math.min(...(a.tasks?.map((t) => new Date(t.dueDate).getTime()) || [Infinity]));
      const nextB = Math.min(...(b.tasks?.map((t) => new Date(t.dueDate).getTime()) || [Infinity]));
      res = nextA - nextB;
    }
    return sortDir === "asc" ? res : -res;
  });
}

// --- Progress bar ---
function ClientProgress({ client }) {
  const total = client.tasks?.length || 0;
  const done = client.tasks?.filter((t) => t.completed).length || 0;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-2 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 shadow-inner"
      />
      <p className="text-xs text-gray-400 mt-1">
        <span className="font-semibold text-white">{done}</span> / {total} tasks
      </p>
    </div>
  );
}

// --- Main ---
export default function ClientsTable({ clients, onUpdateClient }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedClient, setSelectedClient] = useState(null);

  // Toggle task complete
  const handleToggle = useCallback(
    (taskId) => {
      onUpdateClient((prev) =>
        prev.map((c) => ({
          ...c,
          tasks: c.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        }))
      );
    },
    [onUpdateClient]
  );

  // Delete task
  const handleDelete = useCallback(
    (taskId) => {
      onUpdateClient((prev) =>
        prev.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== taskId),
        }))
      );
      toast.success("🗑️ Task deleted");
    },
    [onUpdateClient]
  );

  // Export CSV
  const handleExport = () => {
    toCsv(clients, "clients_export.csv");
    toast.success("📂 Exported to CSV");
  };

  // Filter + Sort
  const filteredClients = useMemo(() => {
    return sortClients(
      clients.filter((c) => {
        const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        const matchPriority =
          priorityFilter === "all" ||
          c.tasks.some((t) => t.priority === priorityFilter);
        const matchDue =
          dueFilter === "all" ||
          (dueFilter === "soon" && c.tasks.some((t) => getDueStatus(t.dueDate)?.includes("Due"))) ||
          (dueFilter === "overdue" && c.tasks.some((t) => getDueStatus(t.dueDate) === "Overdue"));

        return matchSearch && matchStatus && matchPriority && matchDue;
      }),
      sortKey,
      sortDir
    );
  }, [clients, search, statusFilter, priorityFilter, dueFilter, sortKey, sortDir]);

  if (!clients.length) {
    return (
      <Card className="p-10 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <UserPlus className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-300 font-medium mb-2">No clients yet</p>
          <p className="text-gray-400 text-sm">
            Add your first client to start tracking progress 🚀
          </p>
        </motion.div>
      </Card>
    );
  }

  return (
    <section className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative md:w-1/3">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status Filter */}
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select onValueChange={setPriorityFilter} defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Filter */}
        <Select onValueChange={setDueFilter} defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Due" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="soon">Due Soon</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Export */}
        <Button onClick={handleExport} className="ml-auto flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg shadow-black/40">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
            <tr>
              {["name", "email", "status", "progress", "tasks"].map((col) => (
                <th
                  key={col}
                  className="p-3 text-gray-300 cursor-pointer select-none"
                  onClick={() => {
                    if (col === "email" || col === "progress" || col === "tasks") return;
                    setSortKey(col);
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortKey === col && (
                    <span className="ml-1 text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredClients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedClient(client)}
                  className="align-top hover:bg-gray-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-3 border-t border-gray-700 font-medium">{client.name}</td>
                  <td className="p-3 border-t border-gray-700 text-gray-300">{client.email}</td>
                  <td className="p-3 border-t border-gray-700">
                    <Badge
                      className={
                        client.status === "Active"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }
                    >
                      {client.status}
                    </Badge>
                  </td>
                  <td className="p-3 border-t border-gray-700 w-48">
                    <ClientProgress client={client} />
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {client.tasks?.length ? (
                      <div className="space-y-2">
                        {client.tasks.map((task) => {
                          const dueStatus = getDueStatus(task.dueDate);
                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25 }}
                              className="flex items-center justify-between rounded-lg p-2 bg-gray-800/60 border border-gray-700/60 hover:bg-gray-700/70 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleToggle(task.id)}
                                  className="h-4 w-4 accent-blue-500"
                                />
                                <span
                                  className={`${
                                    task.completed
                                      ? "line-through text-gray-500"
                                      : "text-gray-100 font-medium"
                                  }`}
                                >
                                  {task.title}
                                </span>
                                {dueStatus && (
                                  <span className="text-xs px-2 py-1 rounded-full border border-gray-600 text-gray-300">
                                    {dueStatus}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-3">
                                <Pencil className="w-4 h-4 cursor-pointer text-blue-400 hover:scale-110 transition" />
                                <Trash2
                                  className="w-4 h-4 cursor-pointer text-red-400 hover:scale-110 transition"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(task.id);
                                  }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">✨ No tasks yet. Click to add.</p>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      <ClientDetailPanel
        client={selectedClient}
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </section>
  );
}
