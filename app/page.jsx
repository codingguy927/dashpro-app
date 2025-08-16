// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import seedClients from "../data/clients.json";
import ClientsTable from "../components/ClientsTable";
import ClientDetailPanel from "../components/ClientDetailPanel";
import ClientModal from "../components/ClientModal";
import ClientTasksModal from "../components/ClientTasksModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toCsv } from "../utils/exportCsv";
import { toast } from "react-hot-toast";
import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

// 📊 Import Charts
import TasksChart from "../components/TasksChart";
import SignupChart from "../components/SignupChart";
import DonutChart from "../components/DonutChart";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openTasksModal, setOpenTasksModal] = useState(false);

  // Load from localStorage or JSON
  useEffect(() => {
    try {
      const stored = localStorage.getItem("clients");
      let initial = stored ? JSON.parse(stored) : seedClients;

      initial = initial.map((c) => ({
        ...c,
        tasks: Array.isArray(c.tasks) ? c.tasks : [],
      }));

      setClients(initial);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setClients(seedClients);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem("clients", JSON.stringify(clients));
    }
  }, [clients]);

  // Export CSV
  const handleExport = () => {
    const csv = toCsv(clients);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV!");
  };

  // Stats
  const totalClients = clients.length;
  const totalTasks = clients.reduce((sum, c) => sum + c.tasks.length, 0);
  const completedTasks = clients.reduce(
    (sum, c) => sum + c.tasks.filter((t) => t.completed).length,
    0
  );
  const pendingTasks = totalTasks - completedTasks;

  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
    },
  ];

  // 📊 Chart Data
  const taskChartData = [
    { date: "Jan", completed: 5, pending: 2 },
    { date: "Feb", completed: 8, pending: 3 },
    { date: "Mar", completed: 12, pending: 5 },
    { date: "Apr", completed: 15, pending: 4 },
  ];

  const signupData = [
    { month: "Jan", count: 5 },
    { month: "Feb", count: 8 },
    { month: "Mar", count: 12 },
    { month: "Apr", count: 10 },
  ];

  const donutData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];
  const donutColors = ["#22c55e", "#facc15"];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">📊 Dashboard</h1>
        <Button onClick={handleExport} className="transition-transform hover:scale-105">
          Export CSV
        </Button>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, gradient }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 shadow-lg dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="text-2xl font-bold">
                    <CountUp end={value} duration={1.2} />
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-lg dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4">📈 Tasks Over Time</h2>
          <TasksChart data={taskChartData} />
        </Card>

        <Card className="p-6 shadow-lg dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4">🆕 Monthly Signups</h2>
          <SignupChart data={signupData} />
        </Card>

        <Card className="p-6 shadow-lg dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4">✅ Task Breakdown</h2>
          <DonutChart data={donutData} colors={donutColors} />
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="p-6 shadow-lg dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4">👥 Clients Overview</h2>
        <ClientsTable
          clients={clients}
          setClients={setClients}
          onSelectClient={(c) => {
            setSelectedClient(c);
            setOpenDetail(true);
          }}
          onEditClient={(c) => {
            setSelectedClient(c);
            setOpenClientModal(true);
          }}
          onManageTasks={(c) => {
            setSelectedClient(c);
            setOpenTasksModal(true);
          }}
        />
      </Card>

      {/* Modals & Panels */}
      <ClientDetailPanel
        client={selectedClient}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
      <ClientModal
        open={openClientModal}
        client={selectedClient}
        onClose={() => setOpenClientModal(false)}
        onSave={(updated) =>
          setClients((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
      />
      <ClientTasksModal
        open={openTasksModal}
        client={selectedClient}
        onClose={() => setOpenTasksModal(false)}
        onSave={(updated) =>
          setClients((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
      />
    </div>
  );
}
