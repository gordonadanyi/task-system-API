import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskGateway } from '../tasks.gateway/task.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly taskGateway: TaskGateway,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, createdById: string) {
    if (createTaskDto.assignedToId) {
      await this.usersService.findById(createTaskDto.assignedToId);
    }
   
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdById,
    });
    const savedTask = await this.taskRepository.save(task);
    this.taskGateway.server.emit('taskCreated', savedTask);
    return savedTask;
  }

  async getAllTasks() {
    return this.taskRepository.find();
  } 

  async getTaskById(id: string) {
    return this.taskRepository.findOne({ where: { id } });
  } 



  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      return null;
    }
    await this.taskRepository.remove(task);
    this.taskGateway.server.emit('taskDeleted', task.id);
    return { message: 'Task deleted successfully' };

  }     


  async assignTask(id: string, assignTaskDto: AssignTaskDto) {
    await this.usersService.findById(assignTaskDto.assignedToId);

    const task = await this.taskRepository.preload({
      id,
      assignedToId: assignTaskDto.assignedToId,
    });

    if (!task) {
      return null;
    }
    const savedTask = await this.taskRepository.save(task);
    this.taskGateway.server.emit('taskAssigned', savedTask);
    return savedTask;	
  }

  async updateTaskStatus(id: string, userId: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    const task = await this.taskRepository.findOne({
      where :{id},
    });

    if (!task) {
      return null;
    }

    if(task.assignedToId !== userId) {
      throw new ForbiddenException('You are not allowed to update the status of this task');
    }

    task.status= updateTaskStatusDto.status;
    const savedTask = await this.taskRepository.save(task);
    this.taskGateway.server.emit('taskStatusUpdated',savedTask);    
    return savedTask;

  }

  async updateTask(id: string, updateTaskDto: Partial<CreateTaskDto>) {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      return null;
    }
    const savedTask = await this.taskRepository.save(task);
    this.taskGateway.server.emit('taskUpdated', savedTask);
    return savedTask;
  } 
}
