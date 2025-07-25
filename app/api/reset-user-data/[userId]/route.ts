

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function DELETE(_: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  try {
    const res = await fetch(`${API_URL}/reset-user-data/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend reset failed:", text);
      return NextResponse.json({ error: "Backend reset failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Proxy error resetting user data:", err);
    return NextResponse.json({ error: "Failed to reset user data" }, { status: 500 });
  }
}
