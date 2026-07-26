import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('sales-prediction')
  getSalesPrediction() {
    return this.aiService.getSalesPrediction();
  }

  @Get('reorder-suggestions')
  getReorderSuggestions() {
    return this.aiService.getReorderSuggestions();
  }

  @Get('slow-moving-products')
  getSlowMovingProducts() {
    return this.aiService.getSlowMovingProducts();
  }
}
