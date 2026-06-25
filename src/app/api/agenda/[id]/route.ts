import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agenda = await db.agenda.findUnique({
      where: { id },
    });
    if (!agenda) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(agenda);
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
    const { title, description, location, date, startTime, endTime, status, isPublished } = body;

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (date) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (status) updateData.status = status;
    if (typeof isPublished === "boolean") updateData.isPublished = isPublished;

    const agenda = await db.agenda.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, agenda });
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
    await db.agenda.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
