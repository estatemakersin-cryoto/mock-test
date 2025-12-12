export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();

    const { attemptId } = await req.json();
    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID required" },
        { status: 400 }
      );
    }

    // Load attempt + responses
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

    // -------------------------
    // 1️⃣ Prevent test limit below zero
    // -------------------------

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If no tests remaining → stop submission
    if (user.testsRemaining <= 0) {
      return NextResponse.json(
        { error: "No tests remaining" },
        { status: 400 }
      );
    }

    // -------------------------
    // 2️⃣ Evaluate MCQs
    // -------------------------

    let correct = 0;

    const updates = attempt.responses.map((r) => {
      const isCorrect = r.userAnswer === r.question.correctAnswer;
      if (isCorrect) correct++;

      return prisma.response.update({
        where: { id: r.id },
        data: { isCorrect },
      });
    });

    await Promise.all(updates);

    // Update attempt
    await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        correctAnswers: correct,
        score: correct,
      },
    });

    // -------------------------
    // 3️⃣ Safe decrements
    // -------------------------

    await prisma.user.update({
      where: { id: session.id },
      data: {
        testsCompleted: user.testsCompleted + 1,
        testsRemaining: Math.max(user.testsRemaining - 1, 0), // ❗ Prevent negative
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
