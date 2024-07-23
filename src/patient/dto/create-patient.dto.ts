import mongoose from 'mongoose';

export class CreatePatientDto {
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: number;
  gender: string;
  address: string;
  phone: string;
  password: string;
  createdBy: mongoose.Types.ObjectId;
  medPharmaCode: string;
}
