"use server";

import prisma from "./prisma";
import { createSession } from "./session";
import bcrypt from "bcrypt";

interface IFormData {
  phone: string;
  password: string;
  clientType: string;
}

// login process for physical client
export async function login(formData: IFormData) {
  const { phone, password } = formData;
  let userExist = null;

  if (formData.clientType === "PHYSICAL") {
    userExist = await prisma.physicalClient.findFirst({
      where: { phone },
    });
  } else {
    userExist = await prisma.legalClient.findFirst({
      where: { phone },
    });
  }

  if (!userExist) {
    return {
      message: "Ошибка входа!",
    };
  }

  bcrypt.compare(password, userExist.password, (error, res) => {
    if (error) {
      console.error("Incorrect username or password!");
      return;
    }

    if (res) {
      return;
    } else {
      return {
        message: "Ошибка входа!",
      };
    }
  });

  await createSession(userExist.id);
  return userExist;
}
