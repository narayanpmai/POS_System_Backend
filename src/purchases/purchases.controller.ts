
import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) { }

  @Post()
  @Roles('Admin')
  createPurchase(@Body() body: any, @Req() req: any) {
    return this.purchasesService.createPurchase(body, req.user.id);
  }

  @Put(':id')
  @Roles('Admin')
  updatePurchase(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.purchasesService.updatePurchase(+id, body, req.user.id);
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }
}
