import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskGateway } from '../tasks.gateway/task.gateway';
export declare class TasksService {
    private readonly taskRepository;
    private readonly usersService;
    private readonly taskGateway;
    constructor(taskRepository: Repository<Task>, usersService: UsersService, taskGateway: TaskGateway);
    createTask(createTaskDto: CreateTaskDto, createdById: string): Promise<Task>;
    getAllTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    deleteTask(id: string): Promise<{
        message: string;
    } | null>;
    assignTask(id: string, assignTaskDto: AssignTaskDto): Promise<Task | null>;
    updateTaskStatus(id: string, userId: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task | null>;
    updateTask(id: string, updateTaskDto: Partial<CreateTaskDto>): Promise<Task | null>;
}
