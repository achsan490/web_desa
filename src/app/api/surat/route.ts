import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTicketNumber } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  type: z.string().min(1),
  applicantName: z.string().min(2),
  nik: z.string().length(16),
  birthPlace: z.string().optional(),
  address: z.string().min(10),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  purpose: z.string().min(5),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [letters, total] = await Promise.all([
      db.letterRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.letterRequest.count({ where }),
    ]);

    return NextResponse.json({ letters, total, page });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const ticketNumber = generateTicketNumber("SRT");

    const letter = await db.letterRequest.create({
      data: {
        ticketNumber,
        type: data.type,
        applicantName: data.applicantName,
        nik: data.nik,
        birthPlace: data.birthPlace || null,
        address: data.address,
        phone: data.phone,
        email: data.email || null,
        purpose: data.purpose,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      ticketNumber: letter.ticketNumber,
      id: letter.id,
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
    const { id, status, adminNote, pdfUrl } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }

    const letter = await db.letterRequest.update({
      where: { id },
      data: { status, adminNote: adminNote || null, pdfUrl: pdfUrl || null },
    });

    return NextResponse.json({ success: true, letter });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
