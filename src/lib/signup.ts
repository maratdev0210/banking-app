"use server";

import prisma from "./prisma";
import { IMainInfoData, IAdditionalInfoData } from "@/types/auth/physical";
import { ICompanyInfoData, IManagementInfoData } from "@/types/auth/legal";

export async function createUser(
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

export async function createLegalUser(
  companyInfoData: ICompanyInfoData,
  managementInfoData: IManagementInfoData
) {
  let ownershipForm = "MIXED";
  if (companyInfoData?.ownershipForm == "Государственная") {
    ownershipForm = "GOVERNMENT";
  } else if (companyInfoData?.ownershipForm == "Частная") {
    ownershipForm = "PRIVATE";
  } else if (companyInfoData?.ownershipForm == "Иностранная") {
    ownershipForm = "FOREIGN";
  }

  const ceoName =
    managementInfoData.firstNameCeo +
    " " +
    managementInfoData.lastNameCeo +
    " " +
    managementInfoData.middleNameCeo;
  const accountantName =
    managementInfoData.firstNameAccountant +
    " " +
    managementInfoData.lastNameAccountant +
    " " +
    managementInfoData.middleNameAccountant;

  try {
    const client = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          clientType: "LEGAL",
        },
      });
      await tx.legalClient.create({
        data: {
          id: client.id,
          ownershipForm: ownershipForm,
          companyName: companyInfoData?.companyName,
          address: companyInfoData?.address,
          phone: managementInfoData.phone,
          ceoName: ceoName,
          accountantName: accountantName,
        },
      });
    });
    return client;
  } catch (error) {
    console.log(`Error creating client: `, error);
  }
}
