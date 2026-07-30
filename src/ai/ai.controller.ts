import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('sales-prediction')
  getSalesPrediction(@Req() req: any) {
    return this.aiService.getSalesPrediction(req.user.companyId);
  }

  @Get('reorder-suggestions')
  getReorderSuggestions(@Req() req: any) {
    return this.aiService.getReorderSuggestions(req.user.companyId);
  }

  @Get('slow-moving-products')
  getSlowMovingProducts(@Req() req: any) {
    return this.aiService.getSlowMovingProducts(req.user.companyId);
  }
}
