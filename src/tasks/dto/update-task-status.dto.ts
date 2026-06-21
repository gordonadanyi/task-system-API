import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
    @ApiProperty({
          description: 'Update task status',
          example: 'in progress, pending, completed',
        })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
