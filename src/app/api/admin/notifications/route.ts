import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch pending counts
    const pendingComplaintsCount = await db.complaint.count({
      where: { status: "PENDING" },
    });

    const pendingLettersCount = await db.letterRequest.count({
      where: { status: "PENDING" },
    });

    // 2. Fetch the latest pending complaints
    const latestComplaints = await db.complaint.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        ticketNumber: true,
        name: true,
        category: true,
        createdAt: true,
      },
    });

    // 3. Fetch the latest pending letter requests
    const latestLetters = await db.letterRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        ticketNumber: true,
        applicantName: true,
        type: true,
        createdAt: true,
      },
    });

    // 4. Merge and format them into a single sorted list
    const notifications: Array<{
      id: string;
      type: string;
      ticketNumber: string;
      title: string;
      subtitle: string;
      createdAt: Date;
      href: string;
    }> = [
      ...latestComplaints.map((c) => ({
        id: c.id,
        type: "complaint",
        ticketNumber: c.ticketNumber,
        title: `Pengaduan: ${c.name}`,
        subtitle: `Kategori: ${c.category}`,
        createdAt: c.createdAt,
        href: `/admin/pengaduan`,
      })),
      ...latestLetters.map((l) => ({
        id: l.id,
        type: "letter_request",
        ticketNumber: l.ticketNumber,
        title: `Surat: ${l.applicantName}`,
        subtitle: `Tipe: ${(l.type as string).replace("_", " ")}`,
        createdAt: l.createdAt,
        href: `/admin/surat`,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      pendingComplaintsCount,
      pendingLettersCount,
      totalPending: pendingComplaintsCount + pendingLettersCount,
      notifications: notifications.slice(0, 10),
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
