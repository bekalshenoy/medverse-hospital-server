import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { PrismaService } from "src/prisma.service";
import { CompanyService } from "src/company.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, CompanyService],
})
export class AdminModule {}
