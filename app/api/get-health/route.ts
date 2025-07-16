import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const resp = await fetch(`${API_URL}/`, { method: "GET" });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    return NextResponse.json(
      { message: "Network error" },
      { status: 502 }
    );
  }
}
