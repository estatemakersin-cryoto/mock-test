export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔒 Ensure only admin can update revision
    await requireAdmin();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid revision ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.titleEn || !body.titleMr) {
      return NextResponse.json(
        { error: "titleEn and titleMr are required" },
        { status: 400 }
      );
    }

    // Check if exists
    const exists = await prisma.revisionContent.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.revisionContent.update({
      where: { id },
      data: {
        titleEn: body.titleEn,
        titleMr: body.titleMr,
        contentEn: body.contentEn ?? null,
        contentMr: body.contentMr ?? null,
        imageUrl: body.imageUrl ?? null,
        qaJson: body.qaJson ?? [],
        order: body.order ?? exists.order,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Revision updated successfully",
      revision: updated,
    });

  } catch (error: any) {
    console.error("Update revision error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update revision" },
      { status: 500 }
    );
  }
}
