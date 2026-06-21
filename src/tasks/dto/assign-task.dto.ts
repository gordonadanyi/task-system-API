import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {

   @ApiProperty({
        description: 'assign task to user',
      })
  @IsMongoId({ message: 'Assigned user id must be a valid MongoDB id' })
  assignedToId: string;
}
