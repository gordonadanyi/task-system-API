import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto { 
  @ApiProperty({
    example: 'johndoe@test.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  
  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

}
