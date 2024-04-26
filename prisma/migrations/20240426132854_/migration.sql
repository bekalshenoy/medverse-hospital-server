/*
  Warnings:

  - The primary key for the `Section` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Section" DROP CONSTRAINT "Section_pkey",
ADD COLUMN     "sectionId" SERIAL NOT NULL,
ADD CONSTRAINT "Section_pkey" PRIMARY KEY ("sectionId");
