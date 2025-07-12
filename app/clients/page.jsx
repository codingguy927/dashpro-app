"use client";
import ClientsTable from "../../components/ClientsTable";
// If you have a data-fetching helper, call it here instead.
import clients from "../../data/clients.json"; 

export default function ClientsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>
      <ClientsTable clients={clients} />
    </div>
  );
}
