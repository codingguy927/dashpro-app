// components/ClientTasksModal.jsx
"use client";
import { useState, useEffect } from "react";

export default function ClientTasksModal({ task, onSave, onClose }) {
  const [edited, setEdited] = useState(task || { priority: "Medium", due: "" });

  // If the `task` prop changes while open, reset local state
  useEffect(() => {
    if (task) setEdited(task);
  }, [task]);

  if (!task) return null; // ✅ avoid rendering if no task is passed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Edit Task</h2>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col text-sm font-medium">
            Priority:
            <select
              className="mt-1 rounded border px-2 py-1 dark:bg-gray-800"
              value={edited.priority}
              onChange={(e) =>
                setEdited((prev) => ({ ...prev, priority: e.target.value }))
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium">
            Deadline:
            <input
              type="date"
              className="mt-1 rounded border px-2 py-1 dark:bg-gray-800"
              value={edited.due ? edited.due.slice(0, 10) : ""}
              onChange={(e) =>
                setEdited((prev) => ({
                  ...prev,
                  due: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => onSave(edited)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
