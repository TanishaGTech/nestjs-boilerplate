import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UserCreation } from './dto/user.dto';
import ResponseHandler from '../utils/response';
import { ROLES } from 'src/utils/constants';
import { Roles } from 'src/utils/metadata';
import { RoleGaurd } from 'src/utils/roleGaurd';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@Controller('users') /*-- this is a decorator*/
export class UserController extends ResponseHandler {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('getAllUsers')
  @ApiBearerAuth('JWT-auth')
  @Roles(ROLES.ADMIN)
  @UseGuards(RoleGaurd)
  @UseInterceptors(CacheInterceptor) //if you want to cache the api response automatically but this gives custom key based onthe route
  @CacheKey('key-name') //give custom name for the cache
  @CacheTTL(50000) //default will be 5 seconds so we can change it by mentioning seconds in cachettl
  async getAllUsers(@Req() request: Request) {
    try {
      let data = await this.userService.getAllUsers();
      return this.sendSuccessResponse(data, 'fetched all users');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserDocuments(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'file');
  }

  @Get('externalapi')
  async externalApiCallHandeling(@Req() request: Request) {
    { 
      try {
        let data = await this.userService.externalApiCallHandeling();
        return this.sendSuccessResponse(data, 'external api call successfull');
      } catch (err) {
        return this.sendFailedResponse({}, err.message);
      }
    }
  }

  @Post('createUser')
  @ApiBearerAuth('JWT-auth')
  async createUser(
    @Req() request: Request,
    @Body() userCreation: UserCreation,
  ): Promise<object> {
    try {
      let data = await this.userService.createUser(userCreation);
      return this.sendSuccessResponse(data, 'created user successfully');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }

  @Put('editUser/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', required: true, description: 'user id' })
  async editUser(
    @Req() request: Request,
    @Body() userCreation: UserCreation,
    @Param('id') id: any,
  ): Promise<object> {
    try {
      let data = await this.userService.editUser(userCreation, id);
      return this.sendSuccessResponse(data, 'updated user successfully');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', required: true, description: 'user id' })
  async getSingleUser(
    @Req() request: Request,
    @Param('id') id: any,
  ): Promise<object> {
    try {
      let data = await this.userService.getSingleUser(id);

      return this.sendSuccessResponse(data, 'fetched single user successfully');
    } catch (err) {
      return this.sendFailedResponse({}, err.message);
    }
  }
}
