import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(req: NextRequest, context: { params: Record<string, string> }) {
  const { user_id } = context.params;
  const body = await req.json();

  try {
    const resp = await fetch(`${API_URL}/store-device-profile/${user_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error("Failed to store device profile:", error);
    return NextResponse.json({ error: "Failed to store device profile" }, { status: 500 });
  }
}
