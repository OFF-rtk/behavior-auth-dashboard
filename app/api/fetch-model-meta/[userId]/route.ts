import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(_: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const res = await fetch(`${API_URL}/model-meta/${params.userId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch model meta:", err);
    return NextResponse.json({ error: "Failed to fetch model meta" }, { status: 500 });
  }
}
