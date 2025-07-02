"use client";
import dynamic from 'next/dynamic';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, XAxis, Tooltip, Cell, Legend } from 'recharts';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export function DonutChart({ data, colors }) {
  return (
    <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
      <h4 className="mb-2 font-medium">Client Status</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={60} outerRadius={80}>
            {data.map((_, i) => (<Cell key={i} fill={colors[i % colors.length]} />))}
          </Pie>
          <Legend verticalAlign="bottom" height={30} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </MotionDiv>
  );
}

export function SignupBar({ data }) {
  return (
    <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
      <h4 className="mb-2 font-medium">Sign-ups This Year</h4>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((entry, i) => (<Cell key={i} fill="#8B5CF6" />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MotionDiv>
  );
}