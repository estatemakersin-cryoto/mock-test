export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 🔒 User auth required
    const session = await requireUser();

    const { attemptId } = await req.json();
    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID required" },
        { status: 400 }
      );
    }

    // Load attempt + related responses
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: {
          include: { question: true },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    if (attempt.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Already submitted" },
        { status: 400 }
      );
    }

    let correct = 0;

    // Evaluate each response
    const updates = attempt.responses.map((r) => {
      const isCorrect = r.userAnswer === r.question.correctAnswer;
      if (isCorrect) correct++;

      return prisma.response.update({
        where: { id: r.id },
        data: { isCorrect },
      });
    });

    await Promise.all(updates);

    // Update test attempt
    await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        correctAnswers: correct,
        score: correct,
      },
    });

    // 🎯 Update user's test limits only for logged-in users
    await prisma.user.update({
      where: { id: session.id },
      data: {
        testsCompleted: { increment: 1 },
        testsRemaining: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 }
    );
  }
}
