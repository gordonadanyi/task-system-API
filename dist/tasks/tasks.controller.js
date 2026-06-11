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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const jwt_auth_guards_1 = require("../auth/jwt-auth.guards");
const user_schema_1 = require("../users/schemas/user.schema");
const assign_task_dto_1 = require("./dto/assign-task.dto");
const create_task_dto_1 = require("./dto/create-task.dto");
const tasks_service_1 = require("./tasks.service");
const update_task_status_dto_1 = require("./dto/update-task-status.dto");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(createTaskDto, request) {
        return this.tasksService.createTask(createTaskDto, request.user.userId);
    }
    getAll() {
        return this.tasksService.getAllTasks();
    }
    async getById(id) {
        const task = await this.tasksService.getTaskById(id);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async update(id, updateTaskDto) {
        const task = await this.tasksService.updateTask(id, updateTaskDto);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async updateStatus(id, updateTaskStatusDto, req) {
        const task = await this.tasksService.updateTaskStatus(id, req.user.userId, updateTaskStatusDto);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async delete(id) {
        const result = await this.tasksService.deleteTask(id);
        if (!result) {
            throw new common_1.NotFoundException('Task not found');
        }
        return result;
    }
    async assign(id, assignTaskDto) {
        const task = await this.tasksService.assignTask(id, assignTaskDto);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getById", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_status_dto_1.UpdateTaskStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_task_dto_1.AssignTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assign", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map