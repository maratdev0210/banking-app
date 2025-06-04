import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await prisma.session.findFirst({
      where: { endTime: null },
      orderBy: { startTime: "desc" },
    });

    if (!session) {
      return NextResponse.json(null, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { sessionId: session.id },
      include: { sourceAccount: true, targetAccount: true },
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTransfers = 0;
    const depositsByAccountType = { CHECK: 0, SAVINGS: 0 };
    const withdrawalsByAccountType = { CHECK: 0, SAVINGS: 0 };

    for (const tx of transactions) {
      const sourceType = tx.sourceAccount?.accountType;
      const targetType = tx.targetAccount?.accountType;

      if (tx.type === "DEPOSIT" && targetType) {
        totalDeposits += tx.amount;
        depositsByAccountType[targetType] += tx.amount;
      }

      if (tx.type === "WITHDRAWAL" && sourceType) {
        totalWithdrawals += tx.amount;
        withdrawalsByAccountType[sourceType] += tx.amount;
      }

      if (tx.type === "TRANSFER") {
        totalTransfers += tx.amount;
      }
    }

    return NextResponse.json({
      totalDeposits,
      totalWithdrawals,
      totalTransfers,
      depositsByAccountType,
      withdrawalsByAccountType,
    });
  } catch (error) {
    console.error("Ошибка при получении сеанса:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
