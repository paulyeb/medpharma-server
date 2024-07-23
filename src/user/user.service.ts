import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  comparePassword,
  encryptPassword,
  generateUserToken,
  isEmpty,
  isEmail,
  generateCode,
} from 'src/utils/functions';
import { CreateUserDto, LoginPatientDto, LoginUserDto } from './dto';
import {
  NotFoundException,
  UnsuccessfulLoginException,
  UnsuccessfulRegistrationException,
  ValueExistsException,
} from 'src/utils/exceptions';
import { ResponseStatus } from 'src/utils/types';
import { User } from './entities/user.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { firstname, lastname, email, phone } = createUserDto;

      const newUser = new User();

      if (isEmail(email)) {
        const emailExists = await this.userModel.findOne({ email });
        if (emailExists && emailExists._id) {
          throw new ValueExistsException(['email']);
        } else {
          newUser.email = email;
        }
      } else {
        throw new UnsuccessfulRegistrationException('Invalid email address');
      }

      if (!isEmpty(phone)) {
        const phoneExists = await this.userModel.findOne({ phone });
        if (phoneExists && phoneExists._id) {
          throw new ValueExistsException(['phone']);
        } else {
          newUser.phone = phone;
        }
      } else {
        throw new UnsuccessfulRegistrationException('Invalid email address');
      }

      const createStaffCode = async () => {
        const staffID = await generateCode('staff');
        const user = await this.userModel.findOne({ staffID });
        if (user) {
          return createStaffCode();
        }
        return staffID;
      };
      const createPassword = async () => {
        const temporaryPassword = await generateCode();
        return temporaryPassword;
      };

      const generatedPassword = await createPassword();
      const encryptedPassword = await encryptPassword(generatedPassword);

      newUser.firstname = firstname;
      newUser.password = encryptedPassword;
      newUser.lastname = lastname;
      newUser.staffID = await createStaffCode();

      const res = await this.userModel.create(newUser);

      if (res && res._id) {
        const { password, ...userData } = res.toObject();
        return {
          status: ResponseStatus.SUCCESS,
          data: userData,
          temporaryPassword: generatedPassword,
        };
      }

      throw new UnsuccessfulRegistrationException('user');
    } catch (error) {
      return error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { phone, password, staffID } = loginUserDto;
      const user = await this.userModel.findOne({ staffID });
      if (!user)
        throw new UnsuccessfulLoginException(
          'User not found',
          'USER_NOT_FOUND',
        );

      const passwordIsCorrect = await comparePassword(password, user.password);
      if (user?.phone === phone) {
        if (passwordIsCorrect) {
          const { password: hashedPassword, ...userData } = user.toObject();
          return { data: userData, token: await generateUserToken(user._id) };
        } else {
          throw new UnsuccessfulLoginException(
            'Incorrect Password',
            'INCORRECT_PASSWORD',
          );
        }
      } else {
        throw new UnsuccessfulLoginException(
          'Incorrect Phone number',
          'INCORRECT_PHONE_NUMBER',
        );
      }
    } catch (error) {
      return error;
    }
  }

  async loginPatient(loginUserDto: LoginPatientDto) {
    try {
      const { phone, password, medPharmaCode } = loginUserDto;
      const user = await this.patientModel.findOne({ medPharmaCode });
      if (!user)
        throw new UnsuccessfulLoginException(
          'Patient not found',
          'PATIENT_NOT_FOUND',
        );

      const passwordIsCorrect = await comparePassword(password, user.password);
      if (user?.phone === phone) {
        if (passwordIsCorrect) {
          const { password: hashedPassword, ...userData } = user.toObject();
          return { data: userData, token: await generateUserToken(user._id) };
        } else {
          throw new UnsuccessfulLoginException(
            'Incorrect Password',
            'INCORRECT_PASSWORD',
          );
        }
      } else {
        throw new UnsuccessfulLoginException(
          'Incorrect Phone number',
          'INCORRECT_PHONE_NUMBER',
        );
      }
    } catch (error) {
      return error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        const { password, ...userdata } = user.toObject();
        return { user: userdata, success: ResponseStatus.SUCCESS };
      }
      throw new NotFoundException('User');
    } catch (error) {
      return error?.response;
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);

      if (user) return { state: true, status: ResponseStatus.SUCCESS };
      throw new NotFoundException('User');
    } catch (err) {
      return err?.response;
    }
  }
}
