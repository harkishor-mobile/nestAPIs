import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinary: CloudinaryService,
  ) {}

  // register new user into database
  @Post('register')
  @UseInterceptors(FileInterceptor('profile'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() body: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let profileUrl = '';

    if (file) {
      const uploaded = await this.cloudinary.uploadImage(file);
      profileUrl = uploaded.secure_url;
    }

    return this.authService.register({
      ...body,
      profile: profileUrl, // attach profile URL if uploaded
    });
  }

  // login user if exits into database
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    const loginResult = await this.authService.login(body.email, body.password);

    return {
      message: 'Success',
      data: loginResult.user,
      token: loginResult.token,
    };
  }
}
