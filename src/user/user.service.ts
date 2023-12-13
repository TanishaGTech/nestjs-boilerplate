import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { UserCreation } from './dto/user.dto';
import { User, UserSchema } from './entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { apiCall } from 'src/utils/externalApiCall';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAllUsers(): Promise<any[]> {
    let allUsers = await this.userModel.find().exec();
    console.log('entering');
    return allUsers;
  }
  async getSingleUser(id: any): Promise<object> {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('invalid id', HttpStatus.FORBIDDEN);
    }
    let singleUser = await this.userModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
      })
      .exec();
    return singleUser;
  }
  async createUser(userCreation: UserCreation): Promise<object> {
    let newUser = new this.userModel(userCreation);
    return newUser.save();
  }

  async editUser(userCreation: UserCreation, id: any): Promise<object> {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('invalid id', HttpStatus.FORBIDDEN);
    }
    let editUser = this.userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: userCreation },
      { returnOriginal: false },
    );
    return editUser;
  }
   
  async externalApiCallHandeling() {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    let data = await apiCall({ url , method: "get", data: { name: "fg" }})
     return data
  }
  // @Cron('45 * * * * *')
  // cronTesting() {
  //   console.log('testing');
  // }
}
