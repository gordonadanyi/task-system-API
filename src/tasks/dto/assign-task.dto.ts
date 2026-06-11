import { IsMongoId } from 'class-validator';

export class AssignTaskDto {
  @IsMongoId({ message: 'Assigned user id must be a valid MongoDB id' })
  assignedToId: string;
}
