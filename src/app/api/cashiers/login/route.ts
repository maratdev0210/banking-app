import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }

    const cashier = await prisma.cashier.findUnique({
      where: { login },
    });

    if (!cashier || !cashier.isActive) {
      return NextResponse.json(
        { error: "Неверный логин или пользователь неактивен" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await compare(password, cashier.passwordHash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    await createSession(cashier.id);

    await prisma.cashier.update({
      where: { id: cashier.id },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json({
      message: "Успешный вход",
      cashier: {
        id: cashier.id,
        fullName: cashier.fullName,
        login: cashier.login,
      },
    });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    return NextResponse.json({ error: "Ошибка на сервере" }, { status: 500 });
  }
}
