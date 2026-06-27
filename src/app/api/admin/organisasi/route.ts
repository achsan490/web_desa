import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  image: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export async function GET() {
  try {
    const members = await db.organization.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("GET Organization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const member = await db.organization.create({
      data: {
        name: data.name,
        position: data.position,
        image: data.image || null,
        phone: data.phone || null,
        order: data.order,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST Organization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
