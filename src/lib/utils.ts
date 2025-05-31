import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient } from "@/app/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const prisma = new PrismaClient();

export async function generateAccountNumber(
  type: "CHECK" | "SAVINGS"
): Promise<string> {
  const prefix = type === "CHECK" ? "101" : "102";

  const lastAccount = await prisma.account.findFirst({
    where: {
      accountNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      accountNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (lastAccount) {
    const currentNumber = parseInt(lastAccount.accountNumber.split("-")[1]);
    nextNumber = currentNumber + 1;
  }

  const paddedNumber = nextNumber.toString().padStart(3, "0");
  return `${prefix}-${paddedNumber}`;
}
