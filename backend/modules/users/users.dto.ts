import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['owner', 'manager', 'worker'])
  role: string;

  @IsOptional()
  managerId?: number;
}