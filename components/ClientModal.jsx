// components/ClientModal.jsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Plus, X } from "lucide-react";

export default function ClientModal({ client, onSave, triggerLabel = "Add Client" }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // ✅ If editing, pre-fill form with client data
  useEffect(() => {
    if (client) {
      setForm({ name: client.name, email: client.email });
    } else {
      setForm({ name: "", email: "" });
    }
  }, [client]);

  const submit = async (e) => {
    e.preventDefault();

    // For now just pass form back to parent — no API call
    const saved = { ...client, ...form, status: client?.status ?? "Active" };
    onSave(saved);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {!client && <Plus className="w-4 h-4 mr-2" />}
        {triggerLabel}
      </button>

      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-75"
            leave="ease-in duration-200"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-semibold">
                      {client ? "Edit Client" : "Add New Client"}
                    </Dialog.Title>
                    <button onClick={() => setOpen(false)}>
                      <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>

                  <form onSubmit={submit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="mt-1 w-full border rounded px-3 py-2 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="mt-1 w-full border rounded px-3 py-2 dark:bg-gray-700"
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {client ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
