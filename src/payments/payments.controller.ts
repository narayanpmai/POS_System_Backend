import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  processPayment(@Req() req: any, @Body() body: any) {
    return this.paymentsService.processPayment(req.user.companyId, {
      ...body,
      cashierId: req.user.id
    });
  }
}
