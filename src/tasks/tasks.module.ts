import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TasksGatewayModule } from '../tasks.gateway/tasks.gateway.module';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, TasksGatewayModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
