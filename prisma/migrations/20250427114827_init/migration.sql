-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PHYSICAL', 'LEGAL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "OwnershipForm" AS ENUM ('GOVERNMENT', 'PRIVATE', 'FOREIGN', 'MIXED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECK', 'SAVINGS');

-- CreateEnum
CREATE TYPE "CheckType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "clientType" "ClientType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalClient" (
    "id" INTEGER NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "isDebtor" BOOLEAN NOT NULL,
    "photoUrl" TEXT,
    "isEmployee" BOOLEAN NOT NULL,

    CONSTRAINT "PhysicalClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalClient" (
    "id" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ceoName" TEXT NOT NULL,
    "accountantName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "ownershipForm" "OwnershipForm" NOT NULL,

    CONSTRAINT "LegalClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientId" INTEGER NOT NULL,
    "accountType" "AccountType" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckAccount" (
    "id" INTEGER NOT NULL,
    "accountType" "CheckType" NOT NULL,

    CONSTRAINT "CheckAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingAccount" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "SavingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- AddForeignKey
ALTER TABLE "PhysicalClient" ADD CONSTRAINT "PhysicalClient_id_fkey" FOREIGN KEY ("id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalClient" ADD CONSTRAINT "LegalClient_id_fkey" FOREIGN KEY ("id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckAccount" ADD CONSTRAINT "CheckAccount_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
