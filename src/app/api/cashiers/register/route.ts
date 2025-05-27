import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const fullName = `${data.firstName} ${data.lastName} ${data.middleName}`;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const existingCashier = await prisma.cashier.findUnique({
      where: { login: data.username },
    });

    if (existingCashier) {
      return NextResponse.json({ error: "Логин уже занят" }, { status: 400 });
    }

    const newCashier = await prisma.cashier.create({
      data: {
        fullName,
        login: data.username,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({
      id: newCashier.id,
      fullName: newCashier.fullName,
      login: newCashier.login,
      message: "Кассир успешно зарегистрирован",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка регистрации кассира" },
      { status: 500 }
    );
  }
}
