import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAll(): Promise<{
        id: string;
        userName: string;
        email: string;
        roles: UserRole[];
    }[]>;
    assignRoles(id: string, assignRolesDto: AssignRolesDto): Promise<{
        id: string;
        userName: string;
        email: string;
        roles: UserRole[];
    }>;
}
