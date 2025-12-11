// Required for Vercel — prevent static rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    // Ensure only admin can access
    await requireAdmin();

    const chapters = await prisma.chapter.findMany({
      orderBy: { chapterNumber: "asc" },
    });

    return NextResponse.json({ chapters });

  } catch (err: any) {
    console.error("Chapters GET error:", err);

    if (err.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load chapters" },
      { status: 500 }
    );
  }
}
