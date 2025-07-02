"use client";

import { Fragment, useState, useContext } from "react";
import { Dialog, Transition }            from "@headlessui/react";
import { Plus, X }                       from "lucide-react";
import { AuthContext }                   from "./Providers";

export default function AddClientModal({ onClientAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const { token } = useContext(AuthContext);

  const submit = async e => {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, status: "Active" }),
    });
    if (res.ok) {
      const newClient = await res.json();
      onClientAdded(newClient);
      setForm({ name:"", email:"" });
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Client
      </button>

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
                <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-semibold">
                      Add New Client
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
                        onChange={e => setForm(f => ({...f, name: e.target.value}))}
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({...f, email: e.target.value}))}
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Create
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
