import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { RefreshTokenDto } from './dto/refreh-token.dto';
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
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("../users/schemas/user.schema").UserRole[];
        };
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    refreshtoken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
