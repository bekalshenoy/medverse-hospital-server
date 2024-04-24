/*
  Warnings:

  - You are about to drop the `family` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "family" DROP CONSTRAINT "user_foreignkey_family";

-- DropForeignKey
ALTER TABLE "model" DROP CONSTRAINT "researcher_foreignkey_model";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "hospital_foreignkey_report";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "patient_foreignkey_report";

-- DropForeignKey
ALTER TABLE "usage" DROP CONSTRAINT "hospital_foreignkey_logs";

-- DropForeignKey
ALTER TABLE "usage" DROP CONSTRAINT "model_foreignkey_logs";

-- DropTable
DROP TABLE "family";

-- DropTable
DROP TABLE "model";

-- DropTable
DROP TABLE "payment";

-- DropTable
DROP TABLE "report";

-- DropTable
DROP TABLE "usage";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Family" (
    "userId" VARCHAR(320) NOT NULL,
    "memberId" VARCHAR(320) NOT NULL
);

-- CreateTable
CREATE TABLE "Model" (
    "modelId" SERIAL NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "description" VARCHAR(350) NOT NULL,
    "researcherId" VARCHAR(50) NOT NULL,
    "cost" DECIMAL(7,5) NOT NULL,
    "server" VARCHAR(320) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("modelId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" SERIAL NOT NULL,
    "userId" VARCHAR(320) NOT NULL,
    "modelId" INTEGER NOT NULL,
    "amount" DECIMAL(10,5) NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Report" (
    "entryId" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "patientId" VARCHAR(50) NOT NULL,
    "hospitalId" VARCHAR(50) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("entryId")
);

-- CreateTable
CREATE TABLE "Usage" (
    "usageId" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "hospitalId" VARCHAR(50) NOT NULL,
    "doctorId" VARCHAR(320) NOT NULL,
    "logged_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("usageId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" VARCHAR(320) NOT NULL,
    "password" CHAR(60) NOT NULL,
    "role" "Role" NOT NULL,
    "enabled" SMALLINT NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(12),
    "location" VARCHAR(500),
    "dob" CHAR(60),
    "server" VARCHAR(320),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_userId_memberId_key" ON "Family"("userId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "user_foreignkey_family" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "researcher_foreignkey_model" FOREIGN KEY ("researcherId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "hospital_foreignkey_report" FOREIGN KEY ("hospitalId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "patient_foreignkey_report" FOREIGN KEY ("patientId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "hospital_foreignkey_logs" FOREIGN KEY ("hospitalId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "model_foreignkey_logs" FOREIGN KEY ("modelId") REFERENCES "Model"("modelId") ON DELETE CASCADE ON UPDATE NO ACTION;
