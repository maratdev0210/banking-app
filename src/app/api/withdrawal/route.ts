import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isFirstWithdrawalThisMonth } from "@/utils/checkFirstWithdrawal";
import { updateDebtorStatus } from "@/utils/updateDebtorStatus";

export async function POST(req: NextRequest) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { checkAccount: true },
    });

    if (!account) {
      return NextResponse.json({ message: "Счёт не найден" }, { status: 404 });
    }

    let commission = 0;
    const isCredit =
      account.accountType === "CHECK" &&
      account.checkAccount?.accountType === "CREDIT";
    const isDebit =
      account.accountType === "CHECK" &&
      account.checkAccount?.accountType === "DEBIT";
    const isSaving = account.accountType === "SAVINGS";

    if (isCredit) {
      if (account.balance - amount < 0) {
        commission = amount * 0.002;
      }
      if (account.balance - (amount + commission) < -50000) {
        return NextResponse.json(
          { message: "Превышен кредитный лимит" },
          { status: 400 }
        );
      }
    }

    if (isSaving) {
      const first = await isFirstWithdrawalThisMonth(accountId);
      commission = first ? 0 : amount * 0.025;
      if (account.balance < amount + commission) {
        return NextResponse.json(
          { message: "Недостаточно средств на сберегательном счёте" },
          { status: 400 }
        );
      }
    }

    if (isDebit && account.balance < amount) {
      return NextResponse.json(
        { message: "Недостаточно средств на дебетном счёте" },
        { status: 400 }
      );
    }

    const total = amount + commission;

    await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: total } },
      }),
      prisma.transaction.create({
        data: {
          type: "WITHDRAWAL",
          amount,
          fee: commission,
          cashierId: 1,
          sessionId: 1,
          sourceAccountId: accountId,
        },
      }),
    ]);

    await updateDebtorStatus(account.clientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при снятии:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
