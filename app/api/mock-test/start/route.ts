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

// Shuffle utility
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

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const userId = session.id;

    // 1️⃣ Load previously used questions by this user
    const previous = await prisma.response.findMany({
      where: { attempt: { userId } },
      select: { questionId: true },
    });

    const usedIds = new Set(previous.map((x) => x.questionId));
    const selectedIds = new Set<number>();
    const finalQuestionIds: number[] = [];

    const difficulties: Difficulty[] = ["EASY", "MODERATE", "HARD"];

    // 2️⃣ Difficulty selection
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

    // 3️⃣ Global fallback — fill from ANY question
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

    // 4️⃣ If still small (very small DB), just shuffle and use whatever is available
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

    return NextResponse.json({ attemptId: attempt.id });
  } catch (error) {
    console.error("Start Test Error:", error);
    return NextResponse.json(
      { error: "Failed to start test. Please try again." },
      { status: 500 }
    );
  }
}
