"use client";
import CountUp from "react-countup";


export default function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`p-4 rounded-xl shadow text-center ${color.bg} ${color.text}`}>
      <div className="flex justify-center mb-2">
        <Icon className={`w-6 h-6`} />
      </div>
      <p className="text-sm">{label}</p>
      <p className="text-3xl font-bold">
        <CountUp end={value} duration={1} />
      </p>
    </div>
  );
}
