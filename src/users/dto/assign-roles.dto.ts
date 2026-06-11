import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class AssignRolesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one role is required' })
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
