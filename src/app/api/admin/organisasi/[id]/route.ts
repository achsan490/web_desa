import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  position: z.string().min(2).optional(),
  image: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await db.organization.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updated = await db.organization.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : existing.name,
        position: data.position !== undefined ? data.position : existing.position,
        image: data.image !== undefined ? data.image : existing.image,
        phone: data.phone !== undefined ? data.phone : existing.phone,
        order: data.order !== undefined ? data.order : existing.order,
      },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("PATCH Organization Member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await db.organization.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await db.organization.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Organization Member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
