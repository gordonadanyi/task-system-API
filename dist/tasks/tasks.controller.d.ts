import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, request: any): Promise<import("./entities/task.entity").Task>;
    getAll(): Promise<{}>;
    getById(id: string): Promise<{}>;
    update(id: string, updateTaskDto: Partial<CreateTaskDto>): Promise<import("./entities/task.entity").Task>;
    updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, req: any): Promise<import("./entities/task.entity").Task>;
    delete(id: string): Promise<{
        message: string;
    }>;
    assign(id: string, assignTaskDto: AssignTaskDto): Promise<import("./entities/task.entity").Task>;
}
