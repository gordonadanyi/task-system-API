"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const task_entity_1 = require("./entities/task.entity");
const task_gateway_1 = require("../tasks.gateway/task.gateway");
const cache_manager_1 = require("@nestjs/cache-manager");
let TasksService = class TasksService {
    taskRepository;
    usersService;
    taskGateway;
    cacheManager;
    constructor(taskRepository, usersService, taskGateway, cacheManager) {
        this.taskRepository = taskRepository;
        this.usersService = usersService;
        this.taskGateway = taskGateway;
        this.cacheManager = cacheManager;
    }
    async createTask(createTaskDto, createdById) {
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
    async getTaskById(id) {
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
    async deleteTask(id) {
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
    async assignTask(id, assignTaskDto) {
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
    async updateTaskStatus(id, userId, updateTaskStatusDto) {
        const task = await this.taskRepository.findOne({
            where: { id },
        });
        if (!task) {
            return null;
        }
        if (task.assignedToId !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to update the status of this task');
        }
        task.status = updateTaskStatusDto.status;
        const savedTask = await this.taskRepository.save(task);
        await this.cacheManager.del(`task:${id}`);
        await this.cacheManager.del('all_tasks');
        this.taskGateway.server.emit('taskStatusUpdated', savedTask);
        return savedTask;
    }
    async updateTask(id, updateTaskDto) {
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        task_gateway_1.TaskGateway, Object])
], TasksService);
//# sourceMappingURL=tasks.service.js.map