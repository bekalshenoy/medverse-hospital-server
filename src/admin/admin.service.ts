import { Injectable } from "@nestjs/common";
import { Report, Restricted, Role, User } from "@prisma/client";
import { CompanyService } from "src/company.service";
import { Model } from "src/dto/model.dto";
import { Payment } from "src/dto/payment.dto";
import { PrismaService } from "src/prisma.service";
import { Hashing } from "src/utils/hashing.util";

@Injectable()
export class AdminService {
  constructor(
    private companyService: CompanyService,
    private prismaService: PrismaService,
  ) {}

  async addDoctor(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        ...user,
        password: await Hashing.hash(user.password),
        role: Role.ROLE_DOCTOR,
      },
    });
  }

  async getDoctors(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async removeDoctor(doctorId: string): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        userId: doctorId,
      },
    });
  }

  async getReports(): Promise<Report[]> {
    return await this.prismaService.report.findMany();
  }

  async deleteReport(reportId: number): Promise<void> {
    await this.companyService.deleteReport(reportId);

    await this.prismaService.report.delete({
      where: {
        reportId: Number(reportId),
      },
    });
  }

  async getModels(): Promise<Model[]> {
    return await this.companyService.getModels();
  }

  async getRestrictedModel(): Promise<Restricted[]> {
    return await this.prismaService.restricted.findMany();
  }

  async addRestrictedModel(modelId): Promise<void> {
    await this.prismaService.restricted.create({
      data: {
        modelId: modelId,
      },
    });
  }

  async removeRestrictedModel(modelId: number): Promise<void> {
    await this.prismaService.restricted.delete({
      where: {
        modelId: Number(modelId),
      },
    });
  }

  async getPayments(): Promise<Payment[]> {
    return await this.companyService.getPayments();
  }
}
