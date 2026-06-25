import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  url: z.string().url(),
  type: z.string().default("PHOTO"),
  category: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  try {
    const items = await db.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const item = await db.gallery.create({
      data: {
        title: data.title,
        description: data.description || null,
        url: data.url,
        type: data.type,
        category: data.category || null,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
