import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AccountType } from "@/app/generated/prisma";
import { CheckType } from "@/app/generated/prisma";
import { randomUUID } from "crypto";

function generateAccountNumber(type: AccountType) {
  const prefix = type === "CHECK" ? "101" : "102";
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ownerId, accountType, checkType, creditLimit, openingDate } = body;

    if (!ownerId || !accountType || (accountType === "CHECK" && !checkType)) {
      return NextResponse.json(
        { success: false, message: "Неверные данные формы" },
        { status: 400 }
      );
    }

    const accountNumber = generateAccountNumber(accountType);

    const account = await prisma.account.create({
      data: {
        clientId: ownerId,
        accountNumber,
        openedAt: new Date(openingDate),
        accountType,
        balance: 0,
      },
    });

    if (accountType === "CHECK") {
      await prisma.checkAccount.create({
        data: {
          id: account.id,
          accountType: checkType as CheckType,
        },
      });
    } else if (accountType === "SAVINGS") {
      await prisma.savingAccount.create({
        data: {
          id: account.id,
        },
      });
    }

    return NextResponse.json({ success: true, id: account.id });
  } catch (error) {
    console.error("Ошибка при открытии счёта:", error);
    return NextResponse.json(
      { success: false, message: "Серверная ошибка" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const accounts = await prisma.account.findMany({
    include: { checkAccount: true },
  });
  return NextResponse.json(accounts);
}
