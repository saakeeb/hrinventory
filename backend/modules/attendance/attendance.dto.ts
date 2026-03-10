import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class CheckInDTO {
  @IsNotEmpty()
  @IsISO8601()
  checkInTime: string;
}

export class CheckOutDTO {
  @IsNotEmpty()
  @IsISO8601()
  checkOutTime: string;
}