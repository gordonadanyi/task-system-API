import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.userModel.create({
      userName: createUserDto.userName,
      email: createUserDto.email,
      passwordHash,
      roles: createUserDto.roles,
    });

    return this.toPublicUser(createdUser);
  }


  async getAll() {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toPublicUser(user));
  }


  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async assignRoles(id: string, roles: UserRole[]) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { roles }, { new: true, runValidators: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user);
  }

  toPublicUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      roles: user.roles,
    };
  }
}
