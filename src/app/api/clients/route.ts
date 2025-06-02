import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        physical: true,
        legal: true,
      },
    });

    const formatted = clients.map((client) => {
      const isPhysical = client.clientType === "PHYSICAL";
      const fullName = isPhysical
        ? `${client.physical?.lastName ?? ""} ${client.physical?.firstName ?? ""} ${client.physical?.middleName ?? ""}`.trim()
        : (client.legal?.companyName ?? "");

      return {
        id: client.id,
        fullName,
        type: client.clientType,
        isDebtor: client.physical?.isDebtor ?? false,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Ошибка при получении клиентов:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке клиентов" },
      { status: 500 }
    );
  }
}
