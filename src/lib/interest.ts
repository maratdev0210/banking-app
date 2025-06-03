import prisma from "./prisma";

export async function applyMonthlyInterest() {
  const savingAccounts = await prisma.savingAccount.findMany({
    include: { account: true },
  });

  for (const saving of savingAccounts) {
    const interest = (saving.account.balance * 0.15) / 12;
    await prisma.account.update({
      where: { id: saving.account.id },
      data: { balance: { increment: interest } },
    });
  }
}
