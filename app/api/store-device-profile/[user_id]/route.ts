import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const { user_id } = params;
  const body = await req.json();

  // forward to real API
  const resp = await fetch(`${API_URL}/store-device-profile/${user_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}
