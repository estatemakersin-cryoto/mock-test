export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type Difficulty = "EASY" | "MODERATE" | "HARD";

const TOTAL_QUESTIONS = 50;
const TARGET_COUNTS: Record<Difficulty, number> = {
  EASY: 15,       // 30%
  MODERATE: 25,   // 50%
  HARD: 10,       // 20%
};

// ------------------ UTILS -------------------
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  if (count <= 0) return [];
  if (arr.length <= count) return shuffle(arr);
  return shuffle(arr).slice(0, count);
}

// ------------------ MAIN ROUTE -------------------
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const userId = session.id;

    // 🔒 1️⃣ Load user & block if non-premium
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // 🔒 Block users who haven’t purchased premium
    if (!user.packagePurchased) {
      return NextResponse.json(
        { error: "You have not purchased the premium plan." },
        { status: 403 }
      );
    }

    // 🔒 Block users with no tests remaining
    if (user.testsRemaining <= 0) {
      return NextResponse.json(
        { error: "No tests remaining. Please contact admin." },
        { status: 403 }
      );
    }

    // 2️⃣ Load previously used questions
    const previous = await prisma.response.findMany({
      where: { attempt: { userId } },
      select: { questionId: true },
    });

    const usedIds = new Set(previous.map((x) => x.questionId));
    const selectedIds = new Set<number>();
    const finalQuestionIds: number[] = [];

    const difficulties: Difficulty[] = ["EASY", "MODERATE", "HARD"];

    // 3️⃣ Difficulty-wise selection
    for (const diff of difficulties) {
      const target = TARGET_COUNTS[diff];

      const allOfDiff = await prisma.question.findMany({
        where: { difficulty: diff },
        select: { id: true },
      });

      const allIds = allOfDiff.map((q) => q.id);

      // Unused first
      const unused = allIds.filter((id) => !usedIds.has(id));
      const pickUnused = pickRandom(unused, target);

      for (const id of pickUnused) {
        if (!selectedIds.has(id)) {
          selectedIds.add(id);
          finalQuestionIds.push(id);
        }
      }

      // Need more?
      const remaining = target - pickUnused.length;

      if (remaining > 0) {
        const repeats = allIds.filter((id) => !selectedIds.has(id));
        const pickRepeats = pickRandom(repeats, remaining);

        for (const id of pickRepeats) {
          if (!selectedIds.has(id)) {
            selectedIds.add(id);
            finalQuestionIds.push(id);
          }
        }
      }
    }

    // 4️⃣ Global fallback
    if (finalQuestionIds.length < TOTAL_QUESTIONS) {
      const still = TOTAL_QUESTIONS - finalQuestionIds.length;

      const allQuestions = await prisma.question.findMany({
        select: { id: true },
      });

      const allIds = allQuestions.map((q) => q.id);
      const candidates = allIds.filter((id) => !selectedIds.has(id));
      const extra = pickRandom(candidates, still);

      for (const id of extra) {
        selectedIds.add(id);
        finalQuestionIds.push(id);
      }
    }

    const finalList = shuffle(finalQuestionIds).slice(
      0,
      Math.min(TOTAL_QUESTIONS, finalQuestionIds.length)
    );

    if (finalList.length === 0) {
      return NextResponse.json(
        { error: "No questions available." },
        { status: 400 }
      );
    }

    // 5️⃣ Create attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        totalQuestions: finalList.length,
        status: "IN_PROGRESS",
      },
    });

    // 6️⃣ Attach responses
    await prisma.response.createMany({
      data: finalList.map((qid) => ({
        attemptId: attempt.id,
        questionId: qid,
      })),
    });

    // 🔄 Reduce test count
    await prisma.user.update({
      where: { id: userId },
      data: {
        testsRemaining: user.testsRemaining - 1,
      },
    });

    return NextResponse.json({ attemptId: attempt.id });

  } catch (error) {
    console.error("Start Test Error:", error);
    return NextResponse.json(
      { error: "Failed to start test. Please try again." },
      { status: 500 }
    );
  }
}
