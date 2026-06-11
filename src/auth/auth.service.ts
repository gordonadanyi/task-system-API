import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const user = await this.usersService.create(createUserDto);

    return {
      message: 'Registration successful',
      user,
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      accessToken: this.generateToken(user),
      user: this.usersService.toPublicUser(user),
    };
  }
}
