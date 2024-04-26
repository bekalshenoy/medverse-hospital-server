import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Report, Restricted, User } from "@prisma/client";
import { CompanyService } from "src/company.service";
import { MedicalReport } from "src/dto/medical-report.dto";
import { Model } from "src/dto/model.dto";
import { Patient } from "src/dto/patient.dto";
import { EncryptionService } from "src/encryption.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class DoctorService {
  constructor(
    private companyService: CompanyService,
    private encryptionService: EncryptionService,
    private prismaService: PrismaService,
  ) {}

  async getModels(): Promise<Model[]> {
    const restricted: Restricted[] =
      await this.prismaService.restricted.findMany();

    const models: Model[] = await this.companyService.getModels();

    return models.filter((model) => {
      restricted.forEach((restricted) => {
        if (model.modelId == restricted.modelId) {
          return false;
        }
      });

      return true;
    });
  }

  async createPatient(patient: Patient): Promise<void> {
    await this.companyService.createPatient(patient);
  }

  async checkPatient(patientId: string): Promise<boolean> {
    return await this.companyService.checkPatient(patientId);
  }

  async getReports(currentUser: User): Promise<Report[]> {
    return await this.prismaService.report.findMany({
      where: {
        doctorId: currentUser.userId,
      },
    });
  }

  async getReportsByPatient(patientId: string): Promise<Report[]> {
    return await this.prismaService.report.findMany({
      where: {
        patientId: patientId,
      },
    });
  }
  appService;
  async addReport(
    report: MedicalReport,
    password: string,
    dob: string,
    memberId: string,
    currentUser: User,
  ): Promise<void> {
    report.doctorId = currentUser.userId;

    report = await this.encrypt(report, password, dob, memberId);

    const savedReport = await this.prismaService.report.create({
      data: {
        ...report,
        section: null,
      },
    });

    report.section.forEach((section) => {
      this.prismaService.section.create({
        data: {
          ...section,
          reportId: savedReport.reportId,
        },
      });
    });

    if (savedReport == null) {
      throw new InternalServerErrorException("Database Failure");
    }

    this.companyService.addReport(savedReport.reportId, report.patientId);
  }

  async getReport(
    reportId: number,
    password: string,
    dob: string,
    memberId: string,
  ): Promise<MedicalReport> {
    let report: MedicalReport = await this.prismaService.report.findUnique({
      where: {
        reportId: reportId,
      },
      include: {
        section: true,
      },
    });

    if (report == null) {
      throw new NotFoundException("Report not found");
    }

    report = await this.decrypt(report, password, dob, memberId);

    report.iv = null;

    return report;
  }

  async updateReport(
    report: MedicalReport,
    password: string,
    dob: string,
    memberId: string,
    currentUser: User,
  ): Promise<void> {
    report.doctorId = currentUser.userId;

    report = await this.encrypt(report, password, dob, memberId);

    await this.prismaService.report.update({
      where: {
        reportId: report.reportId,
      },
      data: {
        ...report,
        section: null,
      },
    });

    report.section.forEach(async (section) => {
      await this.prismaService.section.update({
        where: {
          sectionId: section.sectionId,
        },
        data: {
          ...section,
          reportId: report.reportId,
        },
      });
    });
  }

  private async encrypt(
    report: MedicalReport,
    password: string,
    dob: string,
    memberId: string,
  ): Promise<MedicalReport> {
    if (
      memberId == null &&
      !(await this.companyService.checkPassword(
        report.patientId,
        password,
        dob,
      ))
    ) {
      throw new NotFoundException("Patient Not Found");
    }

    if (
      memberId != null &&
      !(await this.companyService.checkPatientWithFamily(
        report.patientId,
        memberId,
        password,
        dob,
      ))
    ) {
      throw new NotFoundException("Patient Not Found");
    }

    const iv: Buffer = this.encryptionService.generateIv();

    report.iv = iv;

    try {
      report.section.forEach((section) => {
        section.answer = this.encryptionService.encrypt(
          section.answer,
          this.encryptionService.getKeyFromPassword(dob),
          iv,
        );
      });
    } catch (e) {
      throw new InternalServerErrorException("Failed to encrypt report");
    }

    return report;
  }

  private async decrypt(
    report: MedicalReport,
    password: string,
    dob: string,
    memberId: string,
  ): Promise<MedicalReport> {
    if (
      memberId == null &&
      !(await this.companyService.checkPassword(
        report.patientId,
        password,
        dob,
      ))
    ) {
      throw new NotFoundException("Patient Not Found");
    }

    if (
      memberId != null &&
      !(await this.companyService.checkPatientWithFamily(
        report.patientId,
        memberId,
        password,
        dob,
      ))
    ) {
      throw new NotFoundException("Patient Not Found");
    }

    const iv: Buffer = report.iv;

    try {
      report.section.forEach((section) => {
        section.answer = this.encryptionService.decrypt(
          section.answer,
          this.encryptionService.getKeyFromPassword(dob),
          iv,
        );
      });
    } catch (e) {
      throw new InternalServerErrorException("Failed to decrypt report");
    }

    return report;
  }
}
