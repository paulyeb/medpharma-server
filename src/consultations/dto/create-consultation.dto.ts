import mongoose from 'mongoose';
import { ConsultationType } from '../entities/consultation.entity';

export class CreateConsultationDto {
  patient: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  consultationType: ConsultationType;
  medicalCondition: string;
  date: number;
  note: string;
}
