import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  nik: z.string().length(16),
  name: z.string().min(2),
  birthPlace: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  address: z.string().optional().nullable(),
  rt: z.string().optional().nullable(),
  rw: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const residents = await db.resident.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(residents);
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

    const existing = await db.resident.findUnique({
      where: { nik: data.nik },
    });
    if (existing) {
      return NextResponse.json({ error: "NIK sudah terdaftar" }, { status: 400 });
    }

    const resident = await db.resident.create({
      data: {
        nik: data.nik,
        name: data.name,
        birthPlace: data.birthPlace || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        gender: data.gender,
        address: data.address || null,
        rt: data.rt || null,
        rw: data.rw || null,
        religion: data.religion || null,
        education: data.education || null,
        occupation: data.occupation || null,
        maritalStatus: data.maritalStatus || null,
      },
    });

    return NextResponse.json({ success: true, resident }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
