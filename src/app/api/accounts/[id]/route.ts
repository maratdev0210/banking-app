import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: Number(params.id) },
      include: {
        checkAccount: true,
        client: {
          include: {
            physical: true,
            legal: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Счёт не найден" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Ошибка при получении счёта:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
