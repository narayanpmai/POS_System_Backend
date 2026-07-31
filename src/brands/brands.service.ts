import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')       // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');         // Replace multiple - with single -
}

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateBrandDto) {
    const slug = slugify(dto.name);
    
    // Check uniqueness
    const existing = await this.prisma.brand.findFirst({
      where: {
        companyId,
        OR: [
          { name: dto.name },
          { slug: slug }
        ]
      }
    });
    if (existing) {
      throw new BadRequestException('A brand with this name or slug already exists');
    }

    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug,
        status: dto.status || 'ACTIVE',
        companyId,
      }
    });
  }

  async findAll(companyId: number, search?: string, pageQuery = 1, limitQuery = 10) {
    const page = Math.max(1, Number(pageQuery) || 1);
    const limit = Math.min(500, Math.max(1, Number(limitQuery) || 10));
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(companyId: number, id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand || brand.companyId !== companyId) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(companyId: number, id: number, dto: UpdateBrandDto) {
    await this.findOne(companyId, id);
    
    const data: any = { ...dto };
    if (dto.name) {
      const slug = slugify(dto.name);
      
      // Check uniqueness of new name/slug
      const existing = await this.prisma.brand.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { companyId },
            {
              OR: [
                { name: dto.name },
                { slug: slug }
              ]
            }
          ]
        }
      });
      if (existing) {
        throw new BadRequestException('Another brand with this name or slug already exists');
      }
      
      data.slug = slug;
    }

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(companyId: number, id: number) {
    await this.findOne(companyId, id);
    
    // Check if linked to products
    const linkedProducts = await this.prisma.product.count({ where: { brandId: id } });
    if (linkedProducts > 0) {
      throw new BadRequestException('Cannot delete a brand that has associated products');
    }

    return this.prisma.brand.delete({ where: { id } });
  }
}
