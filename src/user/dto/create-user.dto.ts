import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'FirstName is required' })
  firstname: string;

  @IsNotEmpty({ message: 'lastName is required' })
  lastname: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  password: string;

  phone: string;

  staffID: string;
}
