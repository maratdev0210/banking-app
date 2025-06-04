import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        checkAccount: true,
        savingAccount: true,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Счёт не найден" }, { status: 404 });
    }

    if (account.balance !== 0) {
      return NextResponse.json(
        {
          error: "Нельзя закрыть счёт с ненулевым балансом",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (account.checkAccount) {
        await tx.checkAccount.delete({ where: { id } });
      }
      if (account.savingAccount) {
        await tx.savingAccount.delete({ where: { id } });
      }

      await tx.account.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при закрытии счёта:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
