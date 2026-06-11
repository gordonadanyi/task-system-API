import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("../users/schemas/user.schema").UserRole[];
        };
    }>;
    private generateToken;
    login(email: string, password: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("../users/schemas/user.schema").UserRole[];
        };
    }>;
}
