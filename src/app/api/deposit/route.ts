import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      return NextResponse.json({ message: "Счёт не найден" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          type: "DEPOSIT",
          amount,
          fee: 0,
          cashierId: 1,
          sessionId: 1,
          targetAccountId: accountId,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при пополнении:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
