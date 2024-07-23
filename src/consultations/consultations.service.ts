import { Injectable } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Consultation } from './entities/consultation.entity';
import { Model } from 'mongoose';
import { ResponseStatus } from 'src/utils/types';
import { UnsuccessfulRegistrationException } from 'src/utils/exceptions';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name)
    private consultationModel: Model<Consultation>,
    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async create(createConsultationDto: CreateConsultationDto) {
    try {
      const {
        patient,
        consultationType,
        date,
        createdBy,
        medicalCondition,
        note,
      } = createConsultationDto;

      const newConsultation = new Consultation();

      newConsultation.patient = patient;
      newConsultation.consultationType = consultationType;
      newConsultation.date = date;
      newConsultation.createdBy = createdBy;
      newConsultation.medicalCondition = medicalCondition;
      newConsultation.note = note;

      const res = await this.consultationModel.create(newConsultation);

      if (res && res._id) {
        return { data: res, status: ResponseStatus.SUCCESS };
      }
      throw new UnsuccessfulRegistrationException('Consultation');
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const consultations = await this.consultationModel
        .find()
        .populate(
          'patient',
          ['_id', 'firstname', 'lastname', 'medPharmaCode', 'dateOfBirth'],
          this.patientModel,
        )
        .populate(
          'createdBy',
          ['_id', 'name', 'phone', 'email'],
          this.userModel,
        )
        .exec();

      if (consultations.length) {
        return { status: ResponseStatus.SUCCESS, data: consultations };
      } else {
        return {
          status: ResponseStatus.NOT_FOUND,
          data: 'No consultations found',
        };
      }
    } catch (err) {
      return err;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} consultation`;
  }

  update(id: number, updateConsultationDto: UpdateConsultationDto) {
    return `This action updates a #${id} consultation`;
  }

  remove(id: number) {
    return `This action removes a #${id} consultation`;
  }
}
