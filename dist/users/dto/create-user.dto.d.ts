import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    userName: string;
    email: string;
    password: string;
    roles?: UserRole[];
}
