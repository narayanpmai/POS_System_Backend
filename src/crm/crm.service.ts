import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async getTiers() {
    return this.prisma.membershipTier.findMany({
      orderBy: { minPoints: 'asc' }
    });
  }

  async getCustomerCrmData(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        membershipTier: true,
        rewardPointHistories: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async adjustWallet(customerId: number, amount: number, reason: string) {
    // Basic wallet adjustment (could be hooked into accounting later)
    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        walletBalance: { increment: amount }
      }
    });
  }

  async addRewardPoints(customerId: number, points: number, reason: string) {
    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        points: { increment: points },
        rewardPointHistories: {
          create: { points, reason }
        }
      },
      include: { membershipTier: true }
    });

    // Auto-upgrade tier logic
    const tiers = await this.getTiers();
    const eligibleTier = tiers.reverse().find(t => customer.points >= t.minPoints);
    
    if (eligibleTier && customer.membershipTierId !== eligibleTier.id) {
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { membershipTierId: eligibleTier.id }
      });
    }

    return customer;
  }
}
