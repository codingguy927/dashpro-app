import ClientsTable from "../components/ClientsTable"
import clients from "../data/clients.json"

export default function ClientsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Clients</h1>
      <ClientsTable clients={clients} />
    </div>
  )
}
