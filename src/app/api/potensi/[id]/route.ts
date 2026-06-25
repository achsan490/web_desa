import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const potential = await db.potential.findUnique({
      where: { id },
    });
    if (!potential) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(potential);
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
    const { title, description, category, image, location, contact, isPublished } = body;

    const updateData: Record<string, unknown> = {};
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
    }
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (location !== undefined) updateData.location = location;
    if (contact !== undefined) updateData.contact = contact;
    if (typeof isPublished === "boolean") updateData.isPublished = isPublished;

    const potential = await db.potential.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, potential });
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
    await db.potential.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
