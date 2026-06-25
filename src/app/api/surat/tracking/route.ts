import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket");

    if (!ticket) return NextResponse.json({ error: "Ticket required" }, { status: 400 });

    const letter = await db.letterRequest.findUnique({
      where: { ticketNumber: ticket },
      select: { ticketNumber: true, type: true, status: true, createdAt: true, updatedAt: true, adminNote: true, pdfUrl: true },
    });

    if (!letter) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(letter);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
