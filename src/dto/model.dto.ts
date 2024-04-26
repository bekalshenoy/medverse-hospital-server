import { IsNotEmpty, Length, Max } from "class-validator";

export class Model {
  usage: number;
  modelId: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Length(10, 350)
  description: string;
  @IsNotEmpty()
  researcherId: string;
  @IsNotEmpty()
  @Max(10)
  cost: number;
  @IsNotEmpty()
  server: string;
}
