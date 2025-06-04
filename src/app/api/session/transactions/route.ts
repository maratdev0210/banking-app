import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await prisma.session.findFirst({
      where: { endTime: null },
      orderBy: { startTime: "desc" },
    });

    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { sessionId: session.id },
      orderBy: { timestamp: "desc" },
      include: {
        sourceAccount: { select: { accountNumber: true } },
        targetAccount: { select: { accountNumber: true } },
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Ошибка при получении операций сессии:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
