import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  category: z.string().min(2),
  label: z.string().min(2),
  value: z.number().int().nonnegative(),
  year: z.number().int().default(2025),
});

export async function GET() {
  try {
    const stats = await db.statistic.findMany({
      orderBy: [{ category: "asc" }, { label: "asc" }],
    });
    return NextResponse.json(stats);
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

    const stat = await db.statistic.create({
      data: {
        category: data.category,
        label: data.label,
        value: data.value,
        year: data.year,
      },
    });

    return NextResponse.json({ success: true, stat }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
