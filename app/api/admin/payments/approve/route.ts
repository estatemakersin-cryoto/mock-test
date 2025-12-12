import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        packagePurchased: true,
        packagePurchasedDate: new Date(),
        packageExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100), // 100 days
        hasSeenApprovalMessage: false,
        testsUnlocked: 5,
        testsRemaining: 5,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
