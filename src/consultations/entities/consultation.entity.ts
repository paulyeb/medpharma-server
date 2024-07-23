import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';

export enum ConsultationType {
  DIAGNOSIS = 'Advice on diagnosis',
  TEST = 'Special Test',
  REVIEW = 'Review',
  SURGERY = 'Special Procedures or Surgery',
}

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ ref: Patient.name, type: mongoose.Types.ObjectId, required: true })
  patient: mongoose.Types.ObjectId;

  @Prop({ ref: User.name, type: mongoose.Types.ObjectId, required: true })
  createdBy: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      ConsultationType.DIAGNOSIS,
      ConsultationType.TEST,
      ConsultationType.REVIEW,
      ConsultationType.SURGERY,
    ],
  })
  consultationType: string;

  @Prop({ required: true })
  medicalCondition: string;

  @Prop({ required: true })
  date: number;

  @Prop()
  note: string;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
