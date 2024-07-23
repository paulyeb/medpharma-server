import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';

import { PatientController } from './patient.controller';
import { Patient, PatientSchema } from './entities/patient.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
