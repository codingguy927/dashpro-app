"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import ClientsTable from "@/components/ClientsTable";
import DonutChart from "@/components/DonutChart";
import SignupChart from "@/components/SignupChart";
import TasksChart from "@/components/TasksChart"; // ✅ import TasksChart
import seedClients from "@/data/clients.json";
import { Users, CheckCircle, Pin } from "lucide-react";
import { toCsv } from "@/utils/exportCsv";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);

  // Load clients from localStorage or seed data
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

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const openTasks = clients.reduce(
    (acc, c) => acc + c.tasks.filter((t) => !t.completed).length,
    0
  );

  // ✅ Build dynamic chart data from tasks
  const chartDataObj = clients
    .flatMap((c) => c.tasks)
    .reduce((acc, task) => {
      const date = task.dueDate?.slice(0, 10) || "No Date";
      if (!acc[date]) {
        acc[date] = { date, completed: 0, pending: 0 };
      }
      if (task.completed) {
        acc[date].completed += 1;
      } else {
        acc[date].pending += 1;
      }
      return acc;
    }, {});

  const chartData = Object.values(chartDataObj).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Export CSV
  const exportCSV = () => {
    const csv = toCsv(clients);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="default">+ Add Client</Button>
          <Button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700"
          >
            Download CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={Users}
          label="Total Clients"
          value={totalClients}
          color={{ bg: "bg-indigo-100", text: "text-indigo-600" }}
        />
        <StatsCard
          icon={CheckCircle}
          label="Active Clients"
          value={activeClients}
          color={{ bg: "bg-green-100", text: "text-green-600" }}
        />
        <StatsCard
          icon={Pin}
          label="Open Tasks"
          value={openTasks}
          color={{ bg: "bg-yellow-100", text: "text-yellow-600" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <DonutChart
            data={[
              { name: "Active", value: activeClients },
              { name: "Inactive", value: totalClients - activeClients },
            ]}
            colors={["#10B981", "#EF4444"]}
          />
        </Card>

        <Card className="p-4">
          <SignupChart
            data={[
              { month: "Jan", count: 18 },
              { month: "Feb", count: 33 },
              { month: "Mar", count: 17 },
              { month: "Apr", count: 45 },
              { month: "May", count: 38 },
            ]}
          />
        </Card>
      </div>

      {/* ✅ New TasksChart Section */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">Tasks Timeline</h2>
        <TasksChart data={chartData} />
      </Card>

      {/* Clients Table */}
      <ClientsTable clients={clients} setClients={setClients} />
    </div>
  );
}
