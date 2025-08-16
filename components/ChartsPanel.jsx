// components/ChartsPanel.jsx
"use client";

import TasksChart from "./TasksChart";
import DonutChart from "./DonutChart";
import SignupChart from "./SignupChart";

export default function ChartsPanel({ tasksData, statusData, signupData }) {
  const donutColors = ["#22c55e", "#facc15", "#ef4444"]; // green, yellow, red

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tasks Over Time (line chart) */}
      <div className="col-span-1 lg:col-span-2">
        <TasksChart data={tasksData} />
      </div>

      {/* Client Status (donut chart) */}
      <DonutChart data={statusData} colors={donutColors} />

      {/* New Signups (bar chart) */}
      <div className="col-span-1 lg:col-span-3">
        <SignupChart data={signupData} />
      </div>
    </div>
  );
}
