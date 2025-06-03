import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { fromAccountId, toAccountId, amount } = await req.json();

  if (
    !fromAccountId ||
    !toAccountId ||
    !amount ||
    fromAccountId === toAccountId
  ) {
    return NextResponse.json(
      { success: false, message: "Неверные данные" },
      { status: 400 }
    );
  }

  const from = await prisma.account.findUnique({
    where: { id: fromAccountId },
    include: { checkAccount: true },
  });
  const to = await prisma.account.findUnique({ where: { id: toAccountId } });

  if (!from || !to)
    return NextResponse.json(
      { success: false, message: "Счета не найдены" },
      { status: 404 }
    );

  const isCredit =
    from.accountType === "CHECK" && from.checkAccount?.accountType === "CREDIT";
  const isDebit =
    from.accountType === "CHECK" && from.checkAccount?.accountType === "DEBIT";
  const isSaving = from.accountType === "SAVINGS";

  let fee = 0;
  if (isCredit && from.balance - amount < 0) fee = amount * 0.002;
  if (isSaving) fee = amount * 0.025;

  const total = amount + fee;

  if ((isDebit || isSaving) && from.balance < total) {
    return NextResponse.json(
      { success: false, message: "Недостаточно средств" },
      { status: 400 }
    );
  }

  if (isCredit && from.balance - total < -50000) {
    return NextResponse.json(
      { success: false, message: "Превышен лимит" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.account.update({
      where: { id: from.id },
      data: { balance: { decrement: total } },
    }),
    prisma.account.update({
      where: { id: to.id },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        type: "TRANSFER",
        amount,
        fee,
        cashierId: 1,
        sessionId: 1,
        sourceAccountId: from.id,
        targetAccountId: to.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
