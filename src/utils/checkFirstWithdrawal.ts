import prisma from "@/lib/prisma";

export async function isFirstWithdrawalThisMonth(
  accountId: number
): Promise<boolean> {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await prisma.transaction.count({
    where: {
      sourceAccountId: accountId,
      type: "WITHDRAWAL",
      timestamp: { gte: firstDay },
    },
  });

  return count === 0;
}
