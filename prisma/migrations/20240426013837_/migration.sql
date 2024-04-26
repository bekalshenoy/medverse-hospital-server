/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "doctor_foreignkey_reports";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "userId" VARCHAR(320) NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "password" CHAR(60) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "doctor_foreignkey_reports" FOREIGN KEY ("doctorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;
