import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Diagnosta Core Health",
    timestamp: new Date().toISOString()
  });
}
