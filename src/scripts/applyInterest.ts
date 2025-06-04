import prisma from "@/lib/prisma";

export async function applyMonthlyInterest() {
  const savingAccounts = await prisma.account.findMany({
    where: {
      accountType: "SAVINGS",
      balance: { gt: 0 },
    },
  });

  const interestRate = 0.15 / 12;

  const updates = savingAccounts.map((acc) =>
    prisma.account.update({
      where: { id: acc.id },
      data: {
        balance: {
          increment: acc.balance * interestRate,
        },
      },
    })
  );

  await prisma.$transaction(updates);
  return { updated: updates.length };
}

if (require.main === module) {
  applyMonthlyInterest()
    .then((res) => console.log("Начисление процентов завершено:", res))
    .catch((err) => console.error("Ошибка начисления:", err));
}
