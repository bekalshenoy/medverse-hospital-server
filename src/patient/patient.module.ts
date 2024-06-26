import { Module } from "@nestjs/common";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { CompanyService } from "src/company.service";
import { PrismaService } from "src/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { EncryptionService } from "src/encryption.service";

@Module({
  imports: [HttpModule],
  controllers: [PatientController],
  providers: [PatientService, PrismaService, CompanyService, EncryptionService],
})
export class PatientModule {}
