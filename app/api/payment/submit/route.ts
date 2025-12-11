import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Not authenticated. Please login." },
        { status: 401 }
      );
    }

    const { transactionId, notes } = await req.json();

    if (!transactionId?.trim()) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const amount = 750;        // ⭐ FIXED PREMIUM AMOUNT
    const planType = "PREMIUM"; // ⭐ Only one plan

    const payment = await prisma.paymentProof.create({
      data: {
        userId: session.id,
        amount,
        planType,
        transactionId: transactionId.trim(),
        notes: notes?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
    });

  } catch (err: any) {
    console.error("Payment submit error:", err);
    
    if (err.code === 'P2003') {
      return NextResponse.json(
        { error: "User not found. Please logout and login again." },
        { status: 400 }
      );
    }

    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: "This transaction ID is already submitted." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit payment." },
      { status: 500 }
    );
  }
}
