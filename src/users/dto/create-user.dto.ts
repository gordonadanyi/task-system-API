import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of user',
    example: 'john doe',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'email of user',
    example: 'johndoe@test.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'password of user',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString()
  password: string;


  @ApiProperty({
    description: 'role of user',
    example: 'admin or user',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
}
