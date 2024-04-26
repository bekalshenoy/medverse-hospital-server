/*
  Warnings:

  - You are about to drop the column `enabled` on the `Users` table. All the data in the column will be lost.
  - Changed the type of `role` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROLE_DOCTOR', 'ROLE_ADMIN');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "enabled",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
