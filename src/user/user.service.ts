import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import {
  comparePassword,
  encryptPassword,
  generateUserToken,
  isEmpty,
  isEmail,
} from 'src/utils/functions';
import { CreateUserDto, LoginUserDto } from './dto';
import {
  NotFoundException,
  UnsuccessfulLoginException,
  UnsuccessfulRegistrationException,
  ValueExistsException,
} from 'src/utils/exceptions';
import { ResponseStatus } from 'src/utils/types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, type } = createUserDto;

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

      const encryptedPassword = await encryptPassword(password);

      newUser.name = name;
      newUser.password = encryptedPassword;
      newUser.type = type;

      const res = await this.userModel.create(newUser);
      if (res && res._id) {
        return await this.login({ email: res.email, password });
      }

      throw new UnsuccessfulRegistrationException('user');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userModel.findOne({
        email,
      });
      if (isEmpty(user)) {
        throw new UnsuccessfulLoginException(
          'User not found',
          'USER_NOT_FOUND',
        );
      }

      const isPasswordCorrect = await comparePassword(password, user.password);

      if (user._id && !isPasswordCorrect) {
        throw new UnsuccessfulLoginException(
          'Incorrect Password',
          'INCORRECT_PASSWORD',
        );
      }

      const { password: hashedPassword, ...userData } = user.toObject();

      return { user: userData, token: await generateUserToken(user._id) };
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
