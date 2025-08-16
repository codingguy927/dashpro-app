"use client";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

export default function DonutChart({ data, colors }) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg">
        <p className="text-gray-400">No client data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Client Status</h3>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Legend wrapperStyle={{ color: "#d1d5db" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
