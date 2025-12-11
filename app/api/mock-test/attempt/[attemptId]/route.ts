import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: {
          include: { question: true },
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: { testsCompleted: true },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // ------------------------------------
    // CASE 1: IN PROGRESS
    // ------------------------------------
    if (attempt.status === "IN_PROGRESS") {
      const questions = attempt.responses.map((r) => ({
        responseId: r.id,
        questionId: r.question.id,

        questionEn: r.question.questionEn,
        questionMr: r.question.questionMr,

        optionAEn: r.question.optionAEn,
        optionAMr: r.question.optionAMr,
        optionBEn: r.question.optionBEn,
        optionBMr: r.question.optionBMr,
        optionCEn: r.question.optionCEn,
        optionCMr: r.question.optionCMr,
        optionDEn: r.question.optionDEn,
        optionDMr: r.question.optionDMr,

        userAnswer: r.userAnswer,
        correctAnswer: r.question.correctAnswer,
      }));

      return NextResponse.json({
        attempt: {
          id: attempt.id,
          startTime: attempt.startTime.toISOString(),
          totalQuestions: attempt.totalQuestions,
          testNumber: (attempt.user?.testsCompleted || 0) + 1,
        },
        questions,
      });
    }

    // ------------------------------------
    // CASE 2: COMPLETED
    // ------------------------------------
    if (attempt.status === "COMPLETED") {
      const questions = attempt.responses.map((r) => ({
        responseId: r.id,
        questionId: r.question.id,
        questionEn: r.question.questionEn,
        questionMr: r.question.questionMr,
        optionAEn: r.question.optionAEn,
        optionAMr: r.question.optionAMr,
        optionBEn: r.question.optionBEn,
        optionBMr: r.question.optionBMr,
        optionCEn: r.question.optionCEn,
        optionCMr: r.question.optionCMr,
        optionDEn: r.question.optionDEn,
        optionDMr: r.question.optionDMr,
        userAnswer: r.userAnswer,
        correctAnswer: r.question.correctAnswer,
        isCorrect: r.isCorrect || false,
      }));

      return NextResponse.json({
        attempt: {
          id: attempt.id,
          score: attempt.correctAnswers || 0,
          correctAnswers: attempt.correctAnswers || 0,
          totalQuestions: attempt.totalQuestions,
          startTime: attempt.startTime.toISOString(),
          endTime: attempt.endTime?.toISOString(),
          testNumber: (attempt.user?.testsCompleted || 0) + 1,
        },
        questions,
      });
    }

    return NextResponse.json({ error: "Unknown status" }, { status: 400 });

  } catch (error) {
    console.error("Attempt Load Error:", error);
    return NextResponse.json({ error: "Failed to load attempt" }, { status: 500 });
  }
}
