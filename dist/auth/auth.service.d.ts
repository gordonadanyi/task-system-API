import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDocument } from "../users/schemas/user.schema";
import { Model } from 'mongoose';
import { RefreshToken } from "../users/schemas/refresh-token.schema";
export declare class AuthService {
    private readonly refreshTokenModel;
    private usersService;
    private jwtService;
    constructor(refreshTokenModel: Model<RefreshToken>, usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("src/users/schemas/user.schema").UserRole[];
        };
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            userName: string;
            email: string;
            roles: import("src/users/schemas/user.schema").UserRole[];
        };
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    generateToken(user: UserDocument): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    storeRefreshToken(token: string, userId: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
