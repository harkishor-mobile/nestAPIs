import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  //   Handle logic for register new user into database
  async register(data: Partial<UserDocument>) {
    const existingUser = await this.userService.findUserByEmail(data.email!);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(data.password!, 10);

    const user = await this.userService.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashed,
      profile: data.profile || '',
      fcmToken: data.fcmToken || '',
    });

    // return this.removePassword(user);
    return {
      data: this.removePassword(user),
      message: 'User registered successfully',
    };
  }

  //   Handle logic for login user if user if find in database
  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new BadRequestException('Invalid email or password');

    const payload = { userId: user._id, email: user.email };

    // return login response
    return {
      user: this.removePassword(user),
      token: this.jwtService.sign(payload),
    };
  }

  removePassword(user: User) {
    const obj = user.toObject();
    delete obj.password; // delete password from user response
    return obj as Omit<UserDocument, 'password'>;
  }
}
