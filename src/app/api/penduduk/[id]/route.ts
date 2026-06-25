import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resident = await db.resident.findUnique({
      where: { id },
    });
    if (!resident) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(resident);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { nik, name, birthPlace, birthDate, gender, address, rt, rw, religion, education, occupation, maritalStatus } = body;

    const updateData: Record<string, unknown> = {};
    if (nik) updateData.nik = nik;
    if (name) updateData.name = name;
    if (birthPlace !== undefined) updateData.birthPlace = birthPlace;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (rt !== undefined) updateData.rt = rt;
    if (rw !== undefined) updateData.rw = rw;
    if (religion !== undefined) updateData.religion = religion;
    if (education !== undefined) updateData.education = education;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;

    const resident = await db.resident.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, resident });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.resident.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
