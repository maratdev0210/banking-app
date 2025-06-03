import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = Number(params.id);

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "Некорректный ID счёта" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }],
      },
      orderBy: { timestamp: "desc" },
      take: 5,
      include: {
        sourceAccount: true,
        targetAccount: true,
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Ошибка при получении транзакций:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
