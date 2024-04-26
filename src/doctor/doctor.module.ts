import { Module } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { DoctorController } from "./doctor.controller";
import { CompanyService } from "src/company.service";
import { PrismaService } from "src/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { EncryptionService } from "src/encryption.service";

@Module({
  imports: [HttpModule],
  controllers: [DoctorController],
  providers: [DoctorService, PrismaService, CompanyService, EncryptionService],
})
export class DoctorModule {}
