import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTicketNumber } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  nik: z.string().length(16),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  category: z.string().min(1),
  description: z.string().min(20),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      db.complaint.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.complaint.count(),
    ]);

    return NextResponse.json({ complaints, total, page });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const ticketNumber = generateTicketNumber("PGD");

    const complaint = await db.complaint.create({
      data: {
        ticketNumber,
        name: data.name,
        nik: data.nik,
        email: data.email || null,
        phone: data.phone || null,
        category: data.category,
        description: data.description,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      ticketNumber: complaint.ticketNumber,
      id: complaint.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNote } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }

    const complaint = await db.complaint.update({
      where: { id },
      data: { status, adminNote: adminNote || null },
    });

    return NextResponse.json({ success: true, complaint });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
