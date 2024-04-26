import { Controller, Get, Param, Query } from "@nestjs/common";
import { PatientService } from "./patient.service";

@Controller("/api/v1/patient")
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get("/report/:id")
  async getReport(
    @Param("id") reportId: number,
    @Query("patientId") patientId: string,
    @Query("patientPassword") patientPassword: string,
    @Query("dob") dob: string,
  ) {
    return this.patientService.getReport(
      reportId,
      patientId,
      patientPassword,
      dob,
    );
  }
}
