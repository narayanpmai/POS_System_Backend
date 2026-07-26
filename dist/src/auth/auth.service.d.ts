import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            role: {
                id: number;
                name: string;
                description: string | null;
            };
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            roleId: number;
            active: boolean;
            companyId: number;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            role: {
                id: number;
                name: string;
                description: string | null;
            };
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            roleId: number;
            active: boolean;
            companyId: number;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
}
