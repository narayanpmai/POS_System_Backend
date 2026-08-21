import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(res: any, accessToken: string, refreshToken?: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (accessToken) {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });
    }

    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });
    }
  }

  private clearAuthCookies(res: any) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login with HttpOnly Cookie & Session Tracking' })
  @ApiResponse({ status: 200, description: 'Successful login, sets HttpOnly cookies' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(dto, clientIp, userAgent);

    this.setAuthCookies(res, result.access_token, result.refresh_token);
    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User Registration' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.register(dto);
    if (result.access_token) {
      this.setAuthCookies(res, result.access_token);
    }
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

    this.setAuthCookies(res, result.access_token, result.refresh_token);
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user profile' })
  async getProfile(@Req() req: any) {
    return {
      user: req.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Logout & HttpOnly Cookie Clear' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body('refresh_token') bodyToken?: string,
  ) {
    const token = req.cookies?.refresh_token || bodyToken;
    this.clearAuthCookies(res);
    return this.authService.logout(req.user.id, token);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }
}
