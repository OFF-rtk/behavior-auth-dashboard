// app/api/fetch-device-profile/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  console.log("🔍 API HIT with userId:", userId);
  const backendUrl = `${API_URL}/device-profile/${userId}`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch device profile from backend" },
      { status: 500 }
    );
  }
}
