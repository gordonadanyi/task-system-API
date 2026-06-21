import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { UserRole } from '../users/schemas/user.schema';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags,ApiBadRequestResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('task')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)

export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({
    status: 201,
    description: 'Task Created',
    type: CreateTaskDto,
  })
  @ApiBadRequestResponse({
      description: 'Invalid input',
  })
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: any) {
    return this.tasksService.createTask(createTaskDto, request.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all task' })
  @ApiResponse({
    status: 200,
    description: 'All tasks fetched successfully',
  })
  getAll() {
    return this.tasksService.getAllTasks();
  } 


  @Roles(UserRole.Admin)
  @Get(':id')
  @ApiOperation({ summary: 'Fetch a task by id' })
  @ApiOkResponse({ description: 'Task found' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async getById(@Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Roles(UserRole.Admin)
  @Put(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiOkResponse({ description: 'Task updated',
    type: CreateTaskDto,
    isArray: true
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    const task = await this.tasksService.updateTask(id, updateTaskDto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

@Patch(':id/status')
@ApiOperation({ summary: 'Update status of a task' })
@ApiOkResponse({ description: 'Task status updated ',
  type: UpdateTaskStatusDto,
  isArray: true,
 })
@ApiNotFoundResponse({ description: 'Task not found' })
async updateStatus(
  @Param('id') id: string,
  @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  @Req() req,
){
    const task = await this.tasksService.updateTaskStatus(id,
      req.user.userId,
      updateTaskStatusDto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  } 

@Roles(UserRole.Admin)
@Delete(':id')
@ApiOperation({ summary: 'Delete a task' })
@ApiOkResponse({ description: 'Task deleted ' })
@ApiNotFoundResponse({ description: 'Task not found' })
  async delete(@Param('id') id: string) {
    const result = await this.tasksService.deleteTask(id);

    if (!result) {
      throw new NotFoundException('Task not found');
    }

    return result;
  } 

  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign task to user ' })
  @ApiOkResponse({ description: 'Task assigned to user ',
  type: AssignTaskDto,
  isArray: true,
 })
  async assign(@Param('id') id: string, @Body() assignTaskDto: AssignTaskDto) {
    const task = await this.tasksService.assignTask(id, assignTaskDto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
