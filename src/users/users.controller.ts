import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';


@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({
      status: 200,
      description: 'All users fetched successfully',
      type: CreateUserDto,
      isArray: true,
    })
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id/roles')
  @ApiOperation({ summary: 'Update user role' })
  @ApiOkResponse({
      description: 'User role updated',
      type: AssignRolesDto,
      isArray: true,
    })
  assignRoles(@Param('id') id: string, @Body() assignRolesDto: AssignRolesDto) {
    return this.usersService.assignRoles(id, assignRolesDto.roles);
  }
}
