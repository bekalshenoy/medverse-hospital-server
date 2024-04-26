import { IsNotEmpty, Max } from "class-validator";

export class Payment {
  paymentId: number;
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  modelId: number;
  @IsNotEmpty()
  @Max(100000)
  amount: number;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  endDate: Date;
}
