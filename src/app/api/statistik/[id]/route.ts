import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stat = await db.statistic.findUnique({
      where: { id },
    });
    if (!stat) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(stat);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { label, value, year } = body;

    const updateData: Record<string, unknown> = {};
    if (label) updateData.label = label;
    if (typeof value === "number") updateData.value = value;
    if (typeof year === "number") updateData.year = year;

    const stat = await db.statistic.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, stat });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.statistic.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
