// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Create a new user
   */
  async createUser(data: Partial<User>): Promise<UserDocument> {
    try {
      return await this.userModel.create(data);
    } catch (error) {
      throw new BadRequestException('Failed to create user', error);
    }
  }

  /**
   * Find a user using email
   */
  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  /**
   * Fetch a user by ID and hide password
   */
  async findUserById(userId: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Fetch all users except the logged-in user
   */
  async fetchAllUsers(userId: string) {
    return this.userModel.find({ _id: { $ne: userId } }).select('-password');
  }

  /**
   * Update user by ID
   */
  async updateUser(userId: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Update the currently logged-in user's profile
   */
  async updateLoggedInUser(
    userId: string,
    data: Partial<User>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
