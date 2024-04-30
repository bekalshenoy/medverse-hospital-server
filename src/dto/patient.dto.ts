import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
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
  @Length(12, 12)
  userId: string;
  @IsNotEmpty()
  @Length(1, 320)
  name: string;
  @IsNotEmpty()
  @Length(10, 12)
  @IsNumberString()
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
