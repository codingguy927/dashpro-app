'use client';
import StatusCard from '../components/StatusCard';
import { DonutChart, SignupBar } from '../components/ChartCard';
import { Users, Clock, PauseCircle } from 'lucide-react';
import ClientsTable from '../components/ClientsTable';

export default function DashboardPage() {
  const total = 3, activePct = '67%', inactivePct = '33%';
  const donutData = [ { name: 'Active', value: 2 }, { name: 'Inactive', value: 1 } ];
  const barData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 5 },
    { month: 'Apr', count: 20 },
    { month: 'May', count: 3 },
    { month: 'Jun', count: 15 },
  ];
  const clients = [
    { id:1,name:'Alice Johnson',email:'alice@example.com',status:'Active',priority:'High',due:'2025-07-01' },
    { id:2,name:'Bob Smith',email:'bob@example.com',status:'Inactive',priority:'Low',due:'2025-08-08' },
    { id:3,name:'Carol Lee',email:'carol@example.com',status:'Active',priority:'Medium',due:'2025-07-18' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <StatusCard icon={<Users />} label="Total Clients" value={total} />
        <StatusCard icon={<Clock />} label="Active" value={activePct} />
        <StatusCard icon={<PauseCircle />} label="Inactive" value={inactivePct} />
      </div>

      <h2 className="text-3xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonutChart data={donutData} colors={["#38D397","#F87171"]} />
        <SignupBar data={barData} />
        <ClientsTable clients={clients} />
      </div>
    </div>
  );
}