import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskGateway } from '../tasks.gateway/task.gateway';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly taskGateway: TaskGateway,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
    await this.cacheManager.del('all_tasks');
    return savedTask;
  }

  async getAllTasks() {
    const cacheKey = 'all_tasks';
    const cachedTasks = await this.cacheManager.get(cacheKey);

    if (cachedTasks) {
      console.log('Returning from Redis');
      return cachedTasks;
    }
    console.log('Returning from Postgres');
    const tasks = await this.taskRepository.find();
    await this.cacheManager.set(cacheKey, tasks, 60 * 1000);

    return tasks;
  }

  async getTaskById(id: string) {
    const key = `task:${id}`;
    const cached = await this.cacheManager.get(key);

    if (cached) {
      console.log('Redis');
      return cached;
    }
    console.log('Postgres');
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    if (task) {
      await this.cacheManager.set(key, task, 60 * 1000);
    }
    return task;
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      return null;
    }
    await this.taskRepository.remove(task);
    this.taskGateway.server.emit('taskDeleted', task.id);
    await this.cacheManager.del(`task:${id}`);
    await this.cacheManager.del('all_tasks');
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
    await this.cacheManager.del(`task:${id}`);
    await this.cacheManager.del('all_tasks');
    this.taskGateway.server.emit('taskAssigned', savedTask);
    return savedTask;
  }

  async updateTaskStatus(
    id: string,
    userId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      return null;
    }

    if (task.assignedToId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update the status of this task',
      );
    }

    task.status = updateTaskStatusDto.status;
    const savedTask = await this.taskRepository.save(task);
    await this.cacheManager.del(`task:${id}`);
    await this.cacheManager.del('all_tasks');
    this.taskGateway.server.emit('taskStatusUpdated', savedTask);
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
    await this.cacheManager.del(`task:${id}`);
    await this.cacheManager.del('all_tasks');
    return savedTask;
  }
}
