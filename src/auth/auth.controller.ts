import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserLogin, UserSignUp } from './dto/auth.dto';
import ResponseHandler from '../utils/response';

@Controller('auth') /*-- this is a decorator*/
export class AuthController extends ResponseHandler {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  async login(
    @Req() request: Request,
    @Body() userLogin: UserLogin,
  ): Promise<object> {
    try {
      let data = await this.authService.login(userLogin);
      return this.sendSuccessResponse(data, 'logged in successfully');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }
  @Post('signup')
  async signup(
    @Req() request: Request,
    @Body() userSignUp: UserSignUp,
  ): Promise<object> {
    try {
      let data = await this.authService.signup(userSignUp);
      return this.sendSuccessResponse(data, 'signed up successfully');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }
}
