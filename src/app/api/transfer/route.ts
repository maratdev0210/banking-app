import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateDebtorStatus } from "@/utils/updateDebtorStatus";
import { isFirstWithdrawalThisMonth } from "@/utils/checkFirstWithdrawal";

export async function POST(req: NextRequest) {
  try {
    const { fromAccountId, toAccountId, amount } = await req.json();

    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Неверные данные" },
        { status: 400 }
      );
    }

    if (fromAccountId === toAccountId) {
      return NextResponse.json(
        { success: false, message: "Счета не должны совпадать" },
        { status: 400 }
      );
    }

    const from = await prisma.account.findUnique({
      where: { id: fromAccountId },
      include: { checkAccount: true },
    });
    const to = await prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!from || !to) {
      return NextResponse.json(
        { success: false, message: "Счета не найдены" },
        { status: 404 }
      );
    }

    let commission = 0;
    const isCredit =
      from.accountType === "CHECK" &&
      from.checkAccount?.accountType === "CREDIT";
    const isDebit =
      from.accountType === "CHECK" &&
      from.checkAccount?.accountType === "DEBIT";
    const isSaving = from.accountType === "SAVINGS";

    if (isCredit && from.balance - amount < 0) {
      commission = amount * 0.002;
    }

    if (isSaving) {
      const isFirst = await isFirstWithdrawalThisMonth(from.id);
      commission = isFirst ? 0 : amount * 0.025;
    }

    const totalAmount = amount + commission;

    if ((isDebit || isSaving) && from.balance < totalAmount) {
      return NextResponse.json(
        { success: false, message: "Недостаточно средств" },
        { status: 400 }
      );
    }
    if (isCredit && from.balance - totalAmount < -50000) {
      return NextResponse.json(
        { success: false, message: "Превышен кредитный лимит" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedFrom = await tx.account.update({
        where: { id: from.id },
        data: { balance: { decrement: totalAmount } },
      });

      await tx.account.update({
        where: { id: to.id },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          type: "TRANSFER",
          amount,
          fee: commission,
          cashierId: 1,
          sessionId: 1,
          sourceAccountId: from.id,
          targetAccountId: to.id,
        },
      });

      return updatedFrom.clientId;
    });

    await updateDebtorStatus(result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при переводе:", error);
    return NextResponse.json(
      { success: false, message: "Серверная ошибка" },
      { status: 500 }
    );
  }
}
