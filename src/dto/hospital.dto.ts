import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class Hospital {
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
  @Length(1, 320)
  server: string;
}
