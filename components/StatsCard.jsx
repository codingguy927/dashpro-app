"use client";
import CountUp from "react-countup";

export default function StatsCard({
  icon: Icon,
  label,
  value,
  color = { bg: "bg-gray-100", text: "text-gray-800" }, // ✅ safe default
}) {
  return (
    <div
      className={`p-4 rounded-xl shadow text-center ${color.bg} ${color.text}`}
    >
      {/* Optional icon */}
      <div className="flex justify-center mb-2">
        {Icon ? <Icon className="w-6 h-6" /> : null}
      </div>

      {/* Label */}
      <p className="text-sm">{label}</p>

      {/* Animated value */}
      <p className="text-3xl font-bold">
        <CountUp end={value || 0} duration={1} />
      </p>
    </div>
  );
}
