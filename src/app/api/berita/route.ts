import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";
import { auth } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(5),
  excerpt: z.string().optional(),
  content: z.string().min(20),
  image: z.string().optional(),
  category: z.string().default("PEMERINTAHAN"),
  isPublished: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category && category !== "SEMUA") where.category = category;
    if (q) where.OR = [{ title: { contains: q } }, { excerpt: { contains: q } }];

    const [news, total] = await Promise.all([
      db.news.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { author: { select: { name: true } } },
      }),
      db.news.count({ where }),
    ]);

    return NextResponse.json({ news, total, page });
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

    let slug = generateSlug(data.title);
    const existing = await db.news.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const news = await db.news.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        image: data.image || null,
        category: data.category,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, news }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
