import { HttpStatus, Injectable, HttpException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { comparePassword, hashPassword } from 'src/utils/helper';
import { User } from 'src/user/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache, //cache can also be used like this using get,set,reset,del
  ) {}

  async login(userLogin: any) {
    userLogin = JSON.parse(JSON.stringify(userLogin));

    let findUser = await this.userModel.findOne({
      email: userLogin.email,
    });
    const cachedData = await this.cacheService.get('userdata');
    if (cachedData) {
      return cachedData;
    }
    findUser = JSON.parse(JSON.stringify(findUser));
    if (!findUser) {
      throw new HttpException(
        'user not found with the email id',
        HttpStatus.BAD_REQUEST,
      );
    }
    let correctPassword = await comparePassword(
      userLogin.password,
      findUser.password,
    );
    if (correctPassword) {
      let token = await this.jwtService.signAsync(findUser);
      findUser['token'] = token;
      await this.cacheService.set('userdata', findUser, 30000);
      return findUser;
    }
    throw new HttpException('password did not match', HttpStatus.BAD_REQUEST);
  }

  async signup(userSignUp: any) {
    userSignUp = JSON.parse(JSON.stringify(userSignUp));
    let emailExists: any = await this.userModel.findOne({
      email: userSignUp.email,
    });
    if (emailExists) {
      throw new HttpException(
        'user with the email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    let encryptedPassword = await hashPassword(userSignUp.password);
    userSignUp['password'] = encryptedPassword;
    let data = new this.userModel(userSignUp);
    let createUser = data.save();
    if (createUser) {
      return 'user onboarded successfully';
    }
    throw new HttpException(
      'could not onboard user try again',
      HttpStatus.BAD_REQUEST,
    );
  }
}
