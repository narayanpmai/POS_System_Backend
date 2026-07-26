import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
}
