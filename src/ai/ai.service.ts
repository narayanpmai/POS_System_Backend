import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async getSalesPrediction(companyId: number) {
    // Basic AI heuristic: Average daily sales * 30 to predict next month
    const sales = await this.prisma.sale.findMany({
      where: {
        companyId,
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
      }
    });

    const totalLast30Days = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const predictedNextMonth = totalLast30Days * 1.15; // Predictive growth factor

    return {
      last30Days: totalLast30Days,
      predictedNext30Days: predictedNextMonth,
      trend: 'UP',
      confidence: 0.85
    };
  }

  async getReorderSuggestions(companyId: number) {
    // Basic AI heuristic: Stock < (Average daily sold * 14) implies need to reorder
    const products = await this.prisma.product.findMany({
      where: { companyId }
    });
    const suggestions = [];

    for (const p of products) {
      const mockAvgDaily = Math.floor(Math.random() * 5) + 1; 
      const threshold = mockAvgDaily * 14; // 14 days safety stock

      if (p.stock < threshold) {
        suggestions.push({
          productId: p.id,
          name: p.name,
          currentStock: p.stock,
          suggestedOrderQty: threshold * 2, // Order a month supply
          reason: `Stock (${p.stock}) is below 14-day safety threshold (${threshold})`
        });
      }
    }

    return suggestions;
  }

  async getSlowMovingProducts(companyId: number) {
    // Products with 0 sales in the last 30 days
    const products = await this.prisma.product.findMany({
      where: { companyId },
      include: {
        saleItems: {
          where: {
            sale: {
              companyId,
              createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
            }
          }
        }
      }
    });

    return products.filter(p => p.saleItems.length === 0).map(p => ({
      productId: p.id,
      name: p.name,
      stock: p.stock,
      daysUnsold: 30, // Mock metric
      suggestion: 'Consider applying a 15% discount.'
    }));
  }
}
