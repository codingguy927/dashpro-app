"use client";
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export default function StatusCard({ icon, label, value }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex items-center gap-4"
    >
      <div className="p-3 bg-primary-light rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </MotionDiv>
  );
}