// app/clients/page.jsx
"use client";
import { useState, useEffect, useCallback } from "react";
import ClientsTable from "../../components/ClientsTable";
import seedClients from "../../data/clients.json";
// 1️⃣ Import the CSV helper
import { toCsv } from "../../utils/exportCsv";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  // On mount, seed from localStorage or JSON
  useEffect(() => {
    const stored = localStorage.getItem("clients");
    setClients(stored ? JSON.parse(stored) : seedClients);
  }, []);

  // Persist whenever clients change
  useEffect(() => {
    if (clients.length) {
      localStorage.setItem("clients", JSON.stringify(clients));
    }
  }, [clients]);

  // 2️⃣ Define the CSV download callback
  const downloadCsv = useCallback(() => {
    // Flatten just top-level client info (add fields as needed)
    const flat = clients.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      status: c.status,
      priority: c.priority,
      due: c.due,
    }));
    const blob = toCsv(flat);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [clients]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>

      {/* 3️⃣ Render the Download button */}
      <button
        onClick={downloadCsv}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Download CSV
      </button>

      <ClientsTable clients={clients} onUpdateClient={setClients} />
    </div>
  );
}
