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

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)

export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: any) {
    return this.tasksService.createTask(createTaskDto, request.user.userId);
  }

  @Get()
  getAll() {
    return this.tasksService.getAllTasks();
  } 

  @Roles(UserRole.Admin)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Roles(UserRole.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    const task = await this.tasksService.updateTask(id, updateTaskDto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Patch(':id/status')
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
  async assign(@Param('id') id: string, @Body() assignTaskDto: AssignTaskDto) {
    const task = await this.tasksService.assignTask(id, assignTaskDto);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
