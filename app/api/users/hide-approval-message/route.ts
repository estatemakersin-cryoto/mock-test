import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST() {
  try {
    const session = await requireUser();

    await prisma.user.update({
      where: { id: session.id },
      data: { hasSeenApprovalMessage: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HIDE MESSAGE ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
