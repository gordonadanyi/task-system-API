import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id/roles')
  assignRoles(@Param('id') id: string, @Body() assignRolesDto: AssignRolesDto) {
    return this.usersService.assignRoles(id, assignRolesDto.roles);
  }
}
