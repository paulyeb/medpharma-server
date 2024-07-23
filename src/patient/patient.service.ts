import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './entities/patient.entity';
import { Model } from 'mongoose';
import { encryptPassword, generateCode, isEmpty } from 'src/utils/functions';
import { ResponseStatus } from 'src/utils/types';
import {
  UnsuccessfulRegistrationException,
  ValueExistsException,
} from 'src/utils/exceptions';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const {
        firstname,
        lastname,
        dateOfBirth,
        gender,
        address,
        phone,
        createdBy,
        email,
      } = createPatientDto;

      if (!isEmpty(email)) {
        const emailExists = await this.patientModel.findOne({ email });
        if (emailExists && emailExists._id) {
          throw new ValueExistsException(['email']);
        }
      }
      const phoneExists = await this.patientModel.findOne({ phone });
      if (phoneExists && phoneExists._id) {
        throw new ValueExistsException(['phone']);
      }

      const createMedPharmaCode = async () => {
        const medPharmaCode = await generateCode('patient');
        const user = await this.patientModel.findOne({ medPharmaCode });
        if (user) {
          return createMedPharmaCode();
        }
        return medPharmaCode;
      };

      const createPassword = async () => {
        const temporaryPassword = await generateCode();
        return temporaryPassword;
      };

      const generatedPassword = await createPassword();
      const encryptedPassword = await encryptPassword(generatedPassword);

      const newPatient = new Patient();
      newPatient.firstname = firstname;
      newPatient.lastname = lastname;
      newPatient.dateOfBirth = dateOfBirth;
      newPatient.gender = gender;
      newPatient.address = address;
      newPatient.phone = phone;
      newPatient.createdBy = createdBy;
      newPatient.email = email;
      newPatient.password = encryptedPassword;
      newPatient.medPharmaCode = await createMedPharmaCode();

      const res = await this.patientModel.create(newPatient);
      if (res && res._id) {
        const { password: encryptedPassword, ...patientData } = res.toObject();
        return {
          status: ResponseStatus.SUCCESS,
          data: patientData,
          temporaryPassword: generatedPassword,
        };
      }
      throw new UnsuccessfulRegistrationException('PATIENT');
    } catch (err) {
      return err;
    }
  }

  async findAll() {
    try {
      const patients = await this.patientModel
        .find()
        .populate(
          'createdBy',
          ['_id', 'name', 'phone', 'email'],
          this.userModel,
        )
        .exec();
      if (patients.length > 0) {
        return { status: ResponseStatus.SUCCESS, data: patients };
      } else {
        return { status: ResponseStatus.SUCCESS, message: 'No Patients Found' };
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
