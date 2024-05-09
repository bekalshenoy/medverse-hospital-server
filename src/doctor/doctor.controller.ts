import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Report, Role, Section } from "@prisma/client";
import { AuthGuard } from "src/guards/auth.guard";
import { DoctorService } from "./doctor.service";
import { Patient } from "src/dto/patient.dto";
import { MedicalReport } from "src/dto/medical-report.dto";
import { Model } from "src/dto/model.dto";

@Controller("/api/v1/doctor")
@UseGuards(new AuthGuard(Role.ROLE_DOCTOR))
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get("/model")
  async getModels(): Promise<Model[]> {
    return await this.doctorService.getModels();
  }

  @Post("/patient")
  async createPatient(@Body() patient: Patient): Promise<void> {
    await this.doctorService.createPatient(patient);
  }

  @Get("/patient/:id/check")
  async checkPatient(@Param("id") patientId: string): Promise<boolean> {
    return await this.doctorService.checkPatient(patientId);
  }

  @Get("/patient/:id/password")
  async checkPassword(
    @Param("id") userId: string,
    @Query("password") password: string,
    @Query("dob") dob: string,
  ): Promise<Patient> {
    return await this.doctorService.checkPassword(userId, password, dob);
  }

  @Get("/patient/:patientId/member/:memberId/password")
  async checkPasswordWithMember(
    @Param("patientId") userId: string,
    @Param("memberId") memberId: string,
    @Query("password") password: string,
    @Query("dob") dob: string,
  ): Promise<Patient> {
    return await this.doctorService.checkPatientWithFamily(
      userId,
      memberId,
      password,
      dob,
    );
  }

  @Get("/report")
  async getReports(@Req() req): Promise<Report[]> {
    return await this.doctorService.getReports(req.user);
  }

  @Get("/report/patient/:id")
  async getReportsByPatient(@Param("id") patientId: string): Promise<Report[]> {
    return await this.doctorService.getReportsByPatient(patientId);
  }

  @Post("/report/member/:id")
  async addReportWithMember(
    @Body() report: MedicalReport,
    @Query("password") password: string,
    @Query("dob") dob: string,
    @Param("id") memberId: string,
    @Req() req,
  ): Promise<void> {
    await this.doctorService.addReport(
      report,
      password,
      dob,
      memberId,
      req.user,
    );
  }

  @Get("/report/:reportId/member/:memberId")
  async getReportWithMember(
    @Param("reportId") reportId: number,
    @Query("password") password: string,
    @Query("dob") dob: string,
    @Param("memberId") memberId: string,
  ): Promise<MedicalReport> {
    return await this.doctorService.getReport(
      reportId,
      password,
      dob,
      memberId,
    );
  }

  @Put("/report/member/:id")
  async updateReportWithMember(
    @Body() report: MedicalReport,
    @Query("password") password: string,
    @Query("dob") dob: string,
    @Param("id") memberId: string,
    @Req() req,
  ): Promise<void> {
    await this.doctorService.updateReport(
      report,
      password,
      dob,
      memberId,
      req.user,
    );
  }

  @Post("/report")
  async addReport(
    @Body() report: { patientId: string; section: Section[] },
    @Query("password") password: string,
    @Query("dob") dob: string,
    @Req() req,
  ): Promise<void> {
    await this.doctorService.addReport(
      report as MedicalReport,
      password,
      dob,
      null,
      req.user,
    );
  }

  @Get("/report/:id")
  async getReport(
    @Param("id") reportId: number,
    @Query("password") password: string,
    @Query("dob") dob: string,
  ): Promise<MedicalReport> {
    return await this.doctorService.getReport(reportId, password, dob, null);
  }

  @Put("/report")
  async updateReport(
    @Body() report: { patientId: string; section: Section[] },
    @Query("password") password: string,
    @Query("dob") dob: string,
    @Req() req,
  ): Promise<void> {
    await this.doctorService.updateReport(
      report as MedicalReport,
      password,
      dob,
      null,
      req.user,
    );
  }

  @Post("/report/generate")
  async generateReport(@Body() body: { input: string }): Promise<Section[]> {
    return await this.doctorService.generateReport(body.input);
  }
}
