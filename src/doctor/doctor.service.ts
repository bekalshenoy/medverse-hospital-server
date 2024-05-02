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
      let isRestricted = false;

      restricted.forEach((restricted) => {
        if (model.modelId == restricted.modelId) {
          isRestricted = true;
        }
      });

      if (isRestricted) {
        return false;
      }

      return true;
    });
  }

  async createPatient(patient: Patient): Promise<void> {
    await this.companyService.createPatient(patient);
  }

  async checkPatient(patientId: string): Promise<boolean> {
    return await this.companyService.checkPatient(patientId);
  }

  async checkPassword(
    userId: string,
    password: string,
    dob: string,
  ): Promise<Patient> {
    return await this.companyService.checkPassword(userId, password, dob);
  }

  async checkPatientWithFamily(
    userId: string,
    memberId: string,
    password: string,
    dob: string,
  ): Promise<Patient> {
    return await this.companyService.checkPatientWithFamily(
      userId,
      memberId,
      password,
      dob,
    );
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

  async addReport(
    report: MedicalReport,
    password: string,
    dob: string,
    memberId: string,
    currentUser: User,
  ): Promise<void> {
    report = await this.encrypt(report, password, dob, memberId);

    const currentTimestamp = new Date().toISOString();

    const savedReport = await this.prismaService.report.create({
      data: {
        patientId: report.patientId,
        doctorId: currentUser.userId,
        iv: report.iv,
        createdAt: currentTimestamp,
        modifiedAt: currentTimestamp,
      },
    });

    report.section.forEach(async (section) => {
      await this.prismaService.section.create({
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
        reportId: Number(reportId),
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
    report = await this.encrypt(report, password, dob, memberId);

    await this.prismaService.report.update({
      where: {
        reportId: Number(report.reportId),
      },
      data: {
        doctorId: currentUser.userId,
        iv: report.iv,
        modifiedAt: new Date().toISOString(),
      },
    });

    await this.prismaService.section.deleteMany({
      where: {
        reportId: Number(report.reportId),
      },
    });

    report.section.forEach(async (section) => {
      await this.prismaService.section.create({
        data: {
          ...section,
          reportId: Number(report.reportId),
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

    report.iv = iv.toString("hex");

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

    const iv: Buffer = Buffer.from(report.iv, "hex");

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
