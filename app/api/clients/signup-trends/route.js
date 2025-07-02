// app/api/clients/signup-trends/route.js
import { NextResponse } from "next/server";

// Mock: last 6 months of sign-up counts
export async function GET() {
  const now = new Date();
  const data = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      count: Math.floor(Math.random() * 20) + 1,
    };
  });
  return NextResponse.json(data);
}
