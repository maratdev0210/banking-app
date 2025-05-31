import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateAccountNumber } from "@/lib/utils";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const accountSchema = z.object({
      ownerId: z.number(),
      accountType: z.enum(["CHECK", "SAVINGS"]),
      checkType: z.enum(["DEBIT", "CREDIT"]).optional(),
      creditLimit: z.number().optional().default(0),
      openingDate: z.string().optional(),
    });

    const validatedData = accountSchema.parse(data);

    const accountNumber = await generateAccountNumber(
      validatedData.accountType
    );

    const newAccount = await prisma.account.create({
      data: {
        accountNumber,
        balance: 0,
        clientId: validatedData.ownerId,
        accountType: validatedData.accountType,
        openedAt: validatedData.openingDate
          ? new Date(validatedData.openingDate)
          : new Date(),
      },
    });

    if (validatedData.accountType === "CHECK" && validatedData.checkType) {
      await prisma.checkAccount.create({
        data: {
          id: newAccount.id,
          accountType: validatedData.checkType,
        },
      });
    } else if (validatedData.accountType === "SAVINGS") {
      await prisma.savingAccount.create({
        data: {
          id: newAccount.id,
        },
      });
    }

    return Response.json({
      id: newAccount.id,
      message: "Счет успешно открыт",
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return Response.json({ error: "Не удалось открыть счет" }, { status: 500 });
  }
}
