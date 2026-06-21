import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
   @ApiProperty({
      description: 'assign role to user',
      example: 'admin or user',
    })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one role is required' })
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
