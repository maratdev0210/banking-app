import prisma from "@/lib/prisma";

export async function updateDebtorStatus(clientId: number) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      physical: true,
      accounts: {
        include: {
          checkAccount: true,
        },
      },
    },
  });

  if (!client || client.clientType !== "PHYSICAL" || !client.physical) return;

  const creditAccounts = client.accounts.filter(
    (acc) =>
      acc.accountType === "CHECK" && acc.checkAccount?.accountType === "CREDIT"
  );

  const hasNegativeBalance = creditAccounts.some((acc) => acc.balance < 0);

  await prisma.physicalClient.update({
    where: { id: clientId },
    data: { isDebtor: hasNegativeBalance },
  });
}
