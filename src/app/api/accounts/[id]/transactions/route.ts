import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = Number(params.id);
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    if (isNaN(accountId) || isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json(
        { error: "Неверные параметры запроса" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }],
        },
        orderBy: { timestamp: "desc" },
        skip,
        take: pageSize,
        include: {
          sourceAccount: true,
          targetAccount: true,
        },
      }),
      prisma.transaction.count({
        where: {
          OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }],
        },
      }),
    ]);

    return NextResponse.json({
      transactions,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Ошибка при получении операций:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
