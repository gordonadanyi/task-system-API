import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("../users/schemas/user.schema").UserRole[];
        };
    }>;
    login(loginDto: LoginDto): Promise<{
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
