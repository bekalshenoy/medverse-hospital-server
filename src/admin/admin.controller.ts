import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Report, Restricted, Role, User } from "@prisma/client";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminService } from "./admin.service";
import { Model } from "src/dto/model.dto";
import { Payment } from "src/dto/payment.dto";

@Controller("/api/v1/admin")
@UseGuards(new AuthGuard(Role.ROLE_ADMIN))
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post("/doctor")
  async addDoctor(@Body() user: User): Promise<void> {
    await this.adminService.addDoctor(user);
  }

  @Get("/doctor")
  async getDoctors(): Promise<User[]> {
    return await this.adminService.getDoctors();
  }

  @Delete("/doctor/:id")
  async removeDoctor(@Param("id") doctorId: string): Promise<void> {
    await this.adminService.removeDoctor(doctorId);
  }

  @Get("/report")
  async getReports(): Promise<Report[]> {
    return await this.adminService.getReports();
  }

  @Delete("/report/:id")
  async deleteReport(@Param("id") reportId: number): Promise<void> {
    await this.adminService.deleteReport(reportId);
  }

  @Get("/model")
  async getModels(): Promise<Model[]> {
    return await this.adminService.getModels();
  }

  @Get("/restricted")
  async getRestrictedModel(): Promise<Restricted[]> {
    return await this.adminService.getRestrictedModel();
  }

  @Post("/restricted")
  async addRestrictedModel(@Body() restrictedModel: Restricted): Promise<void> {
    await this.adminService.addRestrictedModel(restrictedModel.modelId);
  }

  @Delete("/restricted/:id")
  async removeRestrictedModel(@Param("id") modelId: number): Promise<void> {
    await this.adminService.removeRestrictedModel(modelId);
  }

  @Get("/payment")
  async getPayments(): Promise<Payment[]> {
    return await this.adminService.getPayments();
  }
}
