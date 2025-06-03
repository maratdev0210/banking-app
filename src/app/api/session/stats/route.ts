import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const [totalAccounts, totalBalanceResult, currentSession] =
      await Promise.all([
        prisma.account.count(),
        prisma.account.aggregate({ _sum: { balance: true } }),
        prisma.session.findFirst({
          where: { endTime: null },
          select: {
            deposits: true,
            withdrawals: true,
          },
        }),
      ]);

    const totalBalance = totalBalanceResult._sum.balance || 0;
    const sessionDeposits = currentSession?.deposits || 0;
    const sessionWithdrawals = currentSession?.withdrawals || 0;

    return Response.json({
      totalAccounts,
      totalBalance,
      sessionDeposits,
      sessionWithdrawals,
    });
  } catch (error) {
    console.error("Session stats error:", error);
    return Response.json(
      { error: "Ошибка получения статистики" },
      { status: 500 }
    );
  }
}
