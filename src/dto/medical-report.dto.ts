import { Section } from "@prisma/client";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class MedicalReport {
  reportId: number;
  @IsNotEmpty()
  @Length(12, 12)
  patientId: string;
  @IsNotEmpty()
  @IsEmail()
  doctorId: string;
  iv: Buffer;
  @IsNotEmpty()
  createdAt: Date;
  @IsNotEmpty()
  modifiedAt: Date;
  @IsNotEmpty()
  section: Section[];
}
