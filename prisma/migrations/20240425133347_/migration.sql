/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `entryId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Report` table. All the data in the column will be lost.
  - You are about to alter the column `patientId` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Char(12)`.
  - You are about to drop the `Family` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_at` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_at` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "user_foreignkey_family";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "researcher_foreignkey_model";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "hospital_foreignkey_report";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "patient_foreignkey_report";

-- DropForeignKey
ALTER TABLE "Usage" DROP CONSTRAINT "hospital_foreignkey_logs";

-- DropForeignKey
ALTER TABLE "Usage" DROP CONSTRAINT "model_foreignkey_logs";

-- AlterTable
CREATE SEQUENCE report_reportid_seq;
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "entryId",
DROP COLUMN "hospitalId",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "doctorId" VARCHAR(320) NOT NULL,
ADD COLUMN     "iv" BYTEA NOT NULL,
ADD COLUMN     "modified_at" TIMESTAMP(6) NOT NULL,
ALTER COLUMN "reportId" SET DEFAULT nextval('report_reportid_seq'),
ALTER COLUMN "patientId" SET DATA TYPE CHAR(12),
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("reportId");
ALTER SEQUENCE report_reportid_seq OWNED BY "Report"."reportId";

-- DropTable
DROP TABLE "Family";

-- DropTable
DROP TABLE "Model";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Usage";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Restricted" (
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "Restricted_pkey" PRIMARY KEY ("modelId")
);

-- CreateTable
CREATE TABLE "Section" (
    "reportId" INTEGER NOT NULL,
    "question" VARCHAR(1500) NOT NULL,
    "answer" VARCHAR(5000) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("reportId","position")
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" VARCHAR(320) NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "enabled" SMALLINT NOT NULL,
    "password" CHAR(60) NOT NULL,
    "role" VARCHAR(50) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "doctor_foreignkey_reports" FOREIGN KEY ("doctorId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "report_foreignkey_sections" FOREIGN KEY ("reportId") REFERENCES "Report"("reportId") ON DELETE CASCADE ON UPDATE NO ACTION;
