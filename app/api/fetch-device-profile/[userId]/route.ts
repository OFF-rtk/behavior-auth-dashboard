// app/api/fetch-device-profile/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  console.log("🔍 API HIT with userId:", params.userId);
  const backendUrl = `${API_URL}/device-profile/${params.userId}`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // No need for mode: 'cors'
    });

    

    const data = await res.json();
    console.log(data)
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch device profile from backend" },
      { status: 500 }
    );
  }
}
