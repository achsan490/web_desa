import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(5),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  date: z.string(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  status: z.string().default("UPCOMING"),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  try {
    const agendas = await db.agenda.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(agendas);
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

    const agenda = await db.agenda.create({
      data: {
        title: data.title,
        description: data.description || null,
        location: data.location || null,
        date: new Date(data.date),
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        status: data.status,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json({ success: true, agenda }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
