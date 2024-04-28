import { IsEmail, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class Hospital {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 320)
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
  @Length(1, 320)
  server: string;
}
