import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login with HttpOnly Cookie & Session Tracking' })
  @ApiResponse({ status: 200, description: 'Successful login, returns bearer JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(dto, clientIp, userAgent);

    if (result.refresh_token) {
      res.cookie('refresh_token', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });
    }

    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.register(dto);
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate JWT Refresh Token via HttpOnly Cookie' })
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body('refresh_token') bodyToken?: string,
  ) {
    const token = req.cookies?.refresh_token || bodyToken;
    const result = await this.authService.refreshToken(token);

    if (result.refresh_token) {
      res.cookie('refresh_token', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });
    }

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User Logout & HttpOnly Cookie Clear' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body('refresh_token') bodyToken?: string,
  ) {
    const token = req.cookies?.refresh_token || bodyToken;
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return this.authService.logout(req.user.id, token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }
}
