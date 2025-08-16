"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClientDetailPanel({ client, open, onClose }) {
  if (!client) return null;

  const totalTasks = client.tasks.length;
  const completedTasks = client.tasks.filter((t) => t.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const progressColor =
    progress < 40 ? "bg-red-500" : progress < 80 ? "bg-yellow-500" : "bg-green-500";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative w-full max-w-md bg-gray-900 h-full shadow-2xl border-l border-gray-800 p-6 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{client.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-300" />
              </Button>
            </div>

            {/* Client Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Joined: {new Date(client.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Badge
                className={`${
                  client.status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {client.status}
              </Badge>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-3 ${progressColor}`}
                />
              </div>
            </div>

            {/* Task List */}
            <div>
              <h3 className="font-semibold text-white mb-2">Tasks</h3>
              <ul className="space-y-2">
                {client.tasks.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded bg-gray-800"
                  >
                    <span className="text-gray-200">{t.title}</span>
                    {t.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </li>
                ))}
                {client.tasks.length === 0 && (
                  <p className="text-gray-400 text-sm">No tasks yet</p>
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
