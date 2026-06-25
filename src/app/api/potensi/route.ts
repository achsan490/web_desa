import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  image: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  try {
    const potentials = await db.potential.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(potentials);
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

    let slug = generateSlug(data.title);
    const existing = await db.potential.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const potential = await db.potential.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        image: data.image || null,
        location: data.location || null,
        contact: data.contact || null,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json({ success: true, potential }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
