"use client";

import { useState, useEffect, useCallback } from "react";
import ClientsTable from "../../components/ClientsTable";   // ✅ correct (2 levels up)
import AddClientModal from "../../components/AddClientModal"; // ✅ correct (2 levels up)
import seedClients from "../../data/clients.json";          // ✅ correct (2 levels up)
import { toCsv } from "../../utils/exportCsv";              // ✅ correct (2 levels up)
import { Button } from "../../components/ui/button";        // ✅ correct
import { Card } from "../../components/ui/card";            // ✅ correct
import { toast } from "react-hot-toast";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  // Load clients from localStorage or JSON
  useEffect(() => {
    try {
      const stored = localStorage.getItem("clients");
      let initial = stored ? JSON.parse(stored) : seedClients;

      // ✅ Normalize tasks
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
    if (clients.length) {
      localStorage.setItem("clients", JSON.stringify(clients));
    }
  }, [clients]);

  // Add new client
  const handleAddClient = (newClient) => {
    setClients((prev) => [...prev, newClient]);
    toast.success(`✅ ${newClient.name} added!`);
  };

  // CSV export
  const downloadCsv = useCallback(() => {
    try {
      if (!clients.length) {
        toast.error("No clients to export");
        return;
      }

      const flat = clients.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        status: c.status,
        priority: c.priority ?? "",
        due: c.due ?? "",
      }));

      const blob = toCsv(flat);
      if (!blob) {
        toast.error("Failed to generate CSV");
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clients.csv";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("✅ Clients exported to CSV!");
    } catch (err) {
      console.error("CSV export failed:", err);
      toast.error("Something went wrong exporting CSV");
    }
  }, [clients]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="flex gap-3">
          <AddClientModal onClientAdded={handleAddClient} />
          <Button
            onClick={downloadCsv}
            className="bg-green-500 hover:bg-green-600"
          >
            Download CSV
          </Button>
        </div>
      </div>

      {/* Content */}
      {clients.length === 0 ? (
        <Card className="p-10 text-center text-gray-500">
          <p>No clients yet. Add some to get started 🚀</p>
        </Card>
      ) : (
        <ClientsTable clients={clients} onUpdateClient={setClients} />
      )}
    </div>
  );
}
