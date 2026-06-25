import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  content: z.string().min(10),
  newsId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await db.comment.create({
      data: {
        name: data.name,
        email: data.email || null,
        content: data.content,
        newsId: data.newsId,
        isApproved: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
