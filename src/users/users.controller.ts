// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { successResponse } from 'src/common/response/response.helper';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

interface JwtRequest extends Request {
  user: { userId: string; email: string };
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * GET all users except logged-in user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async fetchAllUsers(@Request() req: JwtRequest) {
    const users = await this.usersService.fetchAllUsers(req.user.userId);
    return successResponse(users, 'Users fetched successfully');
  }

  /**
   * GET users by id
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('list/:id')
  async fetchUserFromListById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    // return user;
    return successResponse(user, 'Users fetched successfully');
  }

  /**
   * GET profile of logged-in user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getMyProfile(@Request() req: JwtRequest) {
    const user = await this.usersService.findUserById(req.user.userId);
    return successResponse(user, 'User profile fetched');
  }

  /**
   * UPDATE profile (supports JSON or FormData)
   * No userId passed → taken from JWT
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  @UseInterceptors(FileInterceptor('profile'))
  async updateUser(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const updateData: any = { ...body };

    // If image uploaded → upload to Cloudinary
    if (file) {
      const uploaded = await this.cloudinary.uploadImage(file);
      updateData.profile = uploaded.secure_url;
    }

    const updatedUser = await this.usersService.updateLoggedInUser(
      req.user.userId,
      updateData,
    );

    return successResponse(updatedUser, 'Profile updated');
  }
}
