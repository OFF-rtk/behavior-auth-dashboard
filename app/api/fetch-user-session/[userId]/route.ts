import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(_: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    const res = await fetch(`${API_URL}/session-data/${userId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch session:", err);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
