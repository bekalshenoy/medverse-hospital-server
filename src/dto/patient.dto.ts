import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from "class-validator";

export interface Family {
  userId: string;
  memberId: string;
}

export class Patient {
  constructor(
    userId: string,
    name: string,
    phone: string,
    location: string,
    password: string,
    dob: string,
    family: Family[],
  ) {
    this.userId = userId;
    this.name = name;
    this.phone = phone;
    this.location = location;
    this.password = password;
    this.dob = dob;
    this.family = family;
  }

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 320)
  userId: string;
  @IsNotEmpty()
  @Length(1, 320)
  name: string;
  @IsNotEmpty()
  @IsPhoneNumber("IN")
  phone: string;
  @IsNotEmpty()
  @Length(1, 500)
  location: string;
  @IsNotEmpty()
  @Length(8, 50)
  password: string;
  @IsNotEmpty()
  @IsDateString()
  dob: string;
  @IsNotEmpty()
  family: Family[];
}
