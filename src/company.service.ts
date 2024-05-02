import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Patient } from "./dto/patient.dto";
import { Payment } from "./dto/payment.dto";
import { Model } from "./dto/model.dto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  private readonly server = process.env.SERVER + "/api/v1/hospital";
  private access_token = "";

  constructor(private readonly httpService: HttpService) {
    this.auth();
  }

  async auth(): Promise<void> {
    try {
      this.access_token =
        "Bearer " +
        (
          await this.httpService.axiosRef.post(
            process.env.SERVER + "/api/v1/auth/",
            {
              userId: process.env.USERID,
              password: process.env.PASSWORD,
            },
          )
        ).data.access_token;
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async createPatient(patient: Patient): Promise<void> {
    try {
      await this.httpService.axiosRef.post(this.server + "/patient", patient, {
        headers: {
          Authorization: this.access_token,
        },
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
            this.server + "/patient/" + patientId + "/check",
            {
              headers: {
                Authorization: this.access_token,
              },
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
  ): Promise<Patient> {
    try {
      return (
        await this.httpService.axiosRef.get(
          this.server +
            "/patient/" +
            patientId +
            "/password?password=" +
            patientPassword +
            "&dob=" +
            dob,
          {
            headers: {
              Authorization: this.access_token,
            },
          },
        )
      ).data;
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
  ): Promise<Patient> {
    try {
      return (
        await this.httpService.axiosRef.get(
          this.server +
            "/patient/" +
            patientId +
            "/family/" +
            memberId +
            "?password=" +
            memberPassword +
            "&dob=" +
            patientDob,
          {
            headers: {
              Authorization: this.access_token,
            },
          },
        )
      ).data;
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async getModels(): Promise<Model[]> {
    try {
      return (
        await this.httpService.axiosRef.get(this.server + "/model", {
          headers: {
            Authorization: this.access_token,
          },
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
        this.server + "/report/" + reportId + "/patient/" + patientId,
        {},
        {
          headers: {
            Authorization: this.access_token,
          },
        },
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    try {
      await this.httpService.axiosRef.delete(
        this.server + "/report/" + reportId,
        {
          headers: {
            Authorization: this.access_token,
          },
        },
      );
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }

  async getPayments(): Promise<Payment[]> {
    try {
      return (
        await this.httpService.axiosRef.get(this.server + "/payment", {
          headers: {
            Authorization: this.access_token,
          },
        })
      ).data;
    } catch (e) {
      this.logger.debug(e);
      throw new InternalServerErrorException("Company Server Exception");
    }
  }
}
