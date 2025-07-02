// app/api/clients/route.js
import { NextResponse } from "next/server";

const clients = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active" },
  { id: 2, name: "Bob Smith",     email: "bob@example.com",     status: "Inactive" },
  { id: 3, name: "Carol Lee",     email: "carol@example.com",   status: "Active" },
];

export async function GET() {
  return NextResponse.json(clients);
}
