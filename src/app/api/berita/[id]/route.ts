import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await db.news.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(news);
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
    const { isPublished, title, excerpt, content, image, category } = body;

    const updateData: Record<string, unknown> = {};
    if (typeof isPublished === "boolean") {
      updateData.isPublished = isPublished;
      updateData.publishedAt = isPublished ? new Date() : null;
    }
    if (title) { updateData.title = title; updateData.slug = generateSlug(title); }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    if (category) updateData.category = category;

    const news = await db.news.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, news });
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
    await db.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
