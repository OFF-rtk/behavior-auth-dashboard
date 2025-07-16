// app/api/post-end-session/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/end-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to post end-session data:", err);
    return NextResponse.json({ error: "Failed to send session data" }, { status: 500 });
  }
}
