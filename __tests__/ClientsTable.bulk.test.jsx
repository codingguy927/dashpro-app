// __tests__/ClientsTable.bulk.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClientsTable from "../components/ClientsTable";

const sample = [
  { id: "1", name: "A", email: "a@x", status: "Active", priority: "Low", due: "2025-01-01T00:00:00.000Z" },
  { id: "2", name: "B", email: "b@x", status: "Active", priority: "Low", due: "2025-01-02T00:00:00.000Z" },
];

test("bulk select, export & delete", () => {
  const setClients = jest.fn();
  render(<ClientsTable clients={sample} onUpdateClient={setClients} />);

  // 1) Select both rows via the header checkbox (uses aria-label)
  fireEvent.click(
    screen.getByRole("checkbox", { name: /select all clients on page/i })
  );

  // Toolbar appears
  expect(screen.getByText("Export 2 CSV")).toBeInTheDocument();
  expect(screen.getByText("Delete 2")).toBeInTheDocument();

  // 2) Spy on createObjectURL and click Export
  const spy = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
  fireEvent.click(screen.getByText(/Export 2 CSV/i));
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();

  // 3) Click Delete – should call onUpdateClient with a function
  fireEvent.click(screen.getByText(/Delete 2/i));
  expect(setClients).toHaveBeenCalledWith(expect.any(Function));

  // And that updater, when applied to our sample, returns an empty array
  const updater = setClients.mock.calls[0][0];
  expect(updater(sample)).toEqual([]);
});
