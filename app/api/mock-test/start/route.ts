export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 🔒 Ensure logged-in user
    const session = await requireUser();
    const userId = session.id;

    // Load questions
    const [easy, moderate] = await Promise.all([
      prisma.question.findMany({ where: { difficulty: "EASY" }, take: 40 }),
      prisma.question.findMany({ where: { difficulty: "MODERATE" }, take: 40 }),
    ]);

    const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5);

    // Select 20 easy, 30 moderate
    const questions = [
      ...shuffle(easy).slice(0, 20),
      ...shuffle(moderate).slice(0, 30),
    ];

    // Create test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        status: "IN_PROGRESS",
        totalQuestions: 50,
      },
    });

    // Create responses
    await prisma.response.createMany({
      data: questions.map((q) => ({
        attemptId: attempt.id,
        questionId: q.id,
      })),
    });

    return NextResponse.json({ attemptId: attempt.id });
  } catch (error) {
    console.error("Start Test Error:", error);
    return NextResponse.json({ error: "Failed to start test" }, { status: 500 });
  }
}
