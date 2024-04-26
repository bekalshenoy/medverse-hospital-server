import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Patient } from "./dto/patient.dto";
import { Payment } from "./dto/payment.dto";
import { Model } from "./dto/model.dto";

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  private readonly server = this.configService.get<string>("server");

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.httpService.axiosRef
      .get(
        this.server +
          "/auth/ROLE_HOSPITAL?" +
          "userId=" +
          this.configService.get("USERNAME") +
          "&password=" +
          this.configService.get("PASSWORD"),
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        if (!res.data) {
          throw new BadRequestException("Invalid Credentials");
        }
      });
  }

  async createPatient(patient: Patient): Promise<void> {
    try {
      await this.httpService.axiosRef.post("/patient", patient, {
        withCredentials: true,
      });
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async checkPatient(patientId: string): Promise<boolean> {
    try {
      return (
        (
          await this.httpService.axiosRef.get(
            "/patient/" + patientId + "/check",
            {
              withCredentials: true,
            },
          )
        ).data == "true"
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async checkPassword(
    patientId: string,
    patientPassword: string,
    dob: string,
  ): Promise<boolean> {
    try {
      return (
        (
          await this.httpService.axiosRef.get(
            "/patient/" +
              patientId +
              "/password?password=" +
              patientPassword +
              "&dob=" +
              dob,
            {
              withCredentials: true,
            },
          )
        ).data == true
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async checkPatientWithFamily(
    patientId: string,
    memberId: string,
    memberPassword: string,
    patientDob: string,
  ): Promise<boolean> {
    try {
      return (
        (
          await this.httpService.axiosRef.get(
            "/patient/" +
              patientId +
              "/family/" +
              memberId +
              "?password=" +
              memberPassword +
              "&dob=" +
              patientDob,
            {
              withCredentials: true,
            },
          )
        ).data == true
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async getModels(): Promise<Model[]> {
    try {
      return (
        await this.httpService.axiosRef.get("/model", {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async addReport(reportId: number, patientId: string): Promise<void> {
    try {
      await this.httpService.axiosRef.post(
        "/report/" + reportId + "/patient/" + patientId,
        {
          withCredentials: true,
        },
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    try {
      await this.httpService.axiosRef.delete("/report/" + reportId, {
        withCredentials: true,
      });
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async getPayments(): Promise<Payment[]> {
    try {
      return (
        await this.httpService.axiosRef.get("/payment", {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }
}
