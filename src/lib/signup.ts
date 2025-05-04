// photo upload api route

"use server";

import { add } from "date-fns";
import prisma from "./prisma";
import { IMainInfoData, IAdditionalInfoData } from "@/types/auth/physical";

export default async function createUser(
  mainInfoData: IMainInfoData,
  additionalInfoData: IAdditionalInfoData
) {
  let gender = null;
  if (additionalInfoData.gender === "Мужской") {
    gender = "MALE";
  } else {
    gender = "FEMALE";
  }
  try {
    const client = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          clientType: "PHYSICAL",
        },
      });
      await tx.physicalClient.create({
        data: {
          id: client.id,
          lastName: mainInfoData.lastName as string,
          firstName: mainInfoData.firstName as string,
          middleName: mainInfoData.middleName as string,
          birthDate: new Date(additionalInfoData.birthDate),
          address: additionalInfoData.address,
          phone: mainInfoData.phone,
          gender: gender,
          isDebtor: additionalInfoData.isDebtor,
          isEmployee: additionalInfoData.isEmployee,
        },
      });
    });
    return client;
  } catch (error) {
    console.log(`Error creating client: `, error);
  }
}
