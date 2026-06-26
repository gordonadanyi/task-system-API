import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
   @ApiProperty({
        description: 'Tite of task',
        example: 'New task',
      })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

   @ApiProperty({
        description: 'Task description',
        example: 'SQL documentation',
      })
  @IsOptional()
  @IsString()
  description?: string;

   @ApiProperty({
        description: 'update task status',
        example: 'in progress, pending , completed',
      })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  

   @ApiProperty({
        description: 'assign task to user',
        example: 'userid',
      })
  @IsOptional()
  @IsMongoId({ message: 'Assigned user id must be a valid MongoDB id' })
  assignedToId?: string;
}
