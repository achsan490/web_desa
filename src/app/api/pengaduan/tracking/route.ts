import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket");

    if (!ticket) {
      return NextResponse.json({ error: "Ticket required" }, { status: 400 });
    }

    const complaint = await db.complaint.findUnique({
      where: { ticketNumber: ticket },
      select: {
        ticketNumber: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        adminNote: true,
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
