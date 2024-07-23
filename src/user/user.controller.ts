import { Controller, Get, Post, Body, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { CreateUserDto, LoginPatientDto, LoginUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Post('login-patient')
  loginPatient(@Body() loginPatientDto: LoginPatientDto) {
    return this.userService.loginPatient(loginPatientDto);
  }

  @Get('getUserById/:_id')
  getUserById(@Req() request: Request) {
    return this.userService.getUserById(request.params._id);
  }

  @Delete('delete/:id')
  remove(@Req() request: Request) {
    return this.userService.delete(request.params.id);
  }
}
