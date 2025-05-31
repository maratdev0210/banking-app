import prisma from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      physical: true,
      legal: true,
    },
  });

  const formattedClients = clients.map((client) => ({
    id: client.id,
    fullName:
      client.clientType === "PHYSICAL"
        ? `${client.physical?.lastName} ${client.physical?.firstName} ${client.physical?.middleName}`
        : client.legal?.companyName,
    type: client.clientType,
    isDebtor:
      client.clientType === "PHYSICAL" ? client.physical?.isDebtor : false,
  }));

  return Response.json(formattedClients);
}
