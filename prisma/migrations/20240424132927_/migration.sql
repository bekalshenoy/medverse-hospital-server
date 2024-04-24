-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROLE_ADMIN', 'ROLE_RESEARCHER', 'ROLE_HOSPITAL', 'ROLE_PATIENT');

-- CreateTable
CREATE TABLE "family" (
    "user_id" VARCHAR(320) NOT NULL,
    "member_id" VARCHAR(320) NOT NULL
);

-- CreateTable
CREATE TABLE "model" (
    "model_id" SERIAL NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "description" VARCHAR(350) NOT NULL,
    "researcher_id" VARCHAR(50) NOT NULL,
    "cost" DECIMAL(7,5) NOT NULL,
    "server" VARCHAR(320) NOT NULL,

    CONSTRAINT "model_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "user_id" VARCHAR(320) NOT NULL,
    "model_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,5) NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "report" (
    "entry_id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "patient_id" VARCHAR(50) NOT NULL,
    "hospital_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("entry_id")
);

-- CreateTable
CREATE TABLE "usage" (
    "usage_id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "hospital_id" VARCHAR(50) NOT NULL,
    "doctor_id" VARCHAR(320) NOT NULL,
    "logged_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "usage_pkey" PRIMARY KEY ("usage_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(320) NOT NULL,
    "password" CHAR(60) NOT NULL,
    "role" "Role" NOT NULL,
    "enabled" SMALLINT NOT NULL,
    "name" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(12),
    "location" VARCHAR(500),
    "dob" CHAR(60),
    "server" VARCHAR(320),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "family_user_id_member_id_key" ON "family"("user_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_name_key" ON "model"("name");

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "user_foreignkey_family" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "researcher_foreignkey_model" FOREIGN KEY ("researcher_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "hospital_foreignkey_report" FOREIGN KEY ("hospital_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "patient_foreignkey_report" FOREIGN KEY ("patient_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "hospital_foreignkey_logs" FOREIGN KEY ("hospital_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "model_foreignkey_logs" FOREIGN KEY ("model_id") REFERENCES "model"("model_id") ON DELETE CASCADE ON UPDATE NO ACTION;
