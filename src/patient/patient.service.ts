import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Section } from "@prisma/client";
import { CompanyService } from "src/company.service";
import { MedicalReport } from "src/dto/medical-report.dto";
import { EncryptionService } from "src/encryption.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class PatientService {
  logger = new Logger(PatientService.name);

  constructor(
    private companyService: CompanyService,
    private prismaService: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async getReport(
    reportId: number,
    patientId: string,
    patientPassword: string,
    dob: string,
  ): Promise<MedicalReport> {
    const report: MedicalReport = await this.prismaService.report.findUnique({
      where: {
        reportId: reportId,
      },
      include: {
        section: true,
      },
    });

    if (report == null) {
      throw new BadRequestException("Report not found");
    }

    if (
      patientId !== report.patientId ||
      !this.companyService.checkPassword(patientId, patientPassword, dob)
    ) {
      throw new BadRequestException("Patient not found");
    }

    const iv: Buffer = report.iv;

    try {
      report.section.forEach((section: Section) => {
        section.answer = this.encryptionService.decrypt(
          section.answer,
          this.encryptionService.getKeyFromPassword(dob),
          iv,
        );
      });
    } catch (e) {
      this.logger.debug(e.getMessage());
      throw new InternalServerErrorException("Failed to decrypt report");
    }

    report.iv = null;

    return report;
  }
}
