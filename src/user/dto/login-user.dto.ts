import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  staffID: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  phone: string;
}

export class LoginPatientDto {
  @IsNotEmpty()
  medPharmaCode: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  phone: string;
}
