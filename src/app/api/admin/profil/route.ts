import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  history: z.string().min(10),
  vision: z.string().min(5),
  mission: z.string().min(5),
  kepalaName: z.string().min(2),
  kepalaQuote: z.string().optional().nullable(),
  kepalaImage: z.string().optional().nullable(),
  address: z.string().min(5),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export async function GET() {
  try {
    let profile = await db.villageProfile.findFirst();
    if (!profile) {
      // Create a default if somehow it doesn't exist
      profile = await db.villageProfile.create({
        data: {
          id: "village-profile-1",
          history: "Sejarah Desa Pojok Klitih...",
          vision: "Visi Desa Pojok Klitih...",
          mission: "Misi Desa Pojok Klitih...",
          kepalaName: "Pemerintah Desa Pojok Klitih",
          kepalaImage: "/images/gambar5.jpg",
          kepalaQuote: "Bersama Membangun Desa yang Maju, Mandiri, Sejahtera, dan Berbudaya.",
          address: "Kantor Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang, Jawa Timur 61456",
          phone: "-",
          email: "desapojokklitih@gmail.com",
          whatsapp: "",
        },
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET VillageProfile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const profile = await db.villageProfile.findFirst();
    const id = profile?.id || "village-profile-1";

    const updated = await db.villageProfile.upsert({
      where: { id },
      update: {
        history: data.history,
        vision: data.vision,
        mission: data.mission,
        kepalaName: data.kepalaName,
        kepalaQuote: data.kepalaQuote || null,
        kepalaImage: data.kepalaImage || null,
        address: data.address,
        phone: data.phone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      },
      create: {
        id,
        history: data.history,
        vision: data.vision,
        mission: data.mission,
        kepalaName: data.kepalaName,
        kepalaQuote: data.kepalaQuote || null,
        kepalaImage: data.kepalaImage || null,
        address: data.address,
        phone: data.phone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("PUT VillageProfile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
