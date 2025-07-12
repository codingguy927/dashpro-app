// components/ClientTasksModal.jsx
"use client";
import { useState } from "react";

export default function ClientTasksModal({ task, onSave, onClose }) {
  const [edited, setEdited] = useState(task);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Task</h2>
        <label>
          Priority:
          <select
            value={edited.priority}
            onChange={e =>
              setEdited(prev => ({ ...prev, priority: e.target.value }))
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>
          Deadline:
          <input
            type="date"
            value={edited.due.slice(0, 10)}
            onChange={e =>
              setEdited(prev => ({
                ...prev,
                due: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </label>
        <button onClick={() => onSave(edited)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
