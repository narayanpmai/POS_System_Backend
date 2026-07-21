import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';

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

  async create(user: any, dto: CreateBrandDto) {
    const slug = slugify(dto.name);
    
    // Check uniqueness
    const existing = await this.prisma.brand.findFirst({
      where: {
        OR: [
          { name: dto.name },
          { slug: slug }
        ],
        companyId: user.companyId
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
        companyId: user.companyId,
      }
    });
  }

  async findAll(user: any, search?: string) {
    const where: any = { companyId: user.companyId };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } }
      ];
    }
    return this.prisma.brand.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(user: any, id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand || brand.companyId !== user.companyId) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(user: any, id: number, dto: UpdateBrandDto) {
    await this.findOne(user, id);
    
    const data: any = { ...dto };
    if (dto.name) {
      const slug = slugify(dto.name);
      
      // Check uniqueness of new name/slug
      const existing = await this.prisma.brand.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                { name: dto.name },
                { slug: slug }
              ]
            },
            { companyId: user.companyId }
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

  async remove(user: any, id: number) {
    await this.findOne(user, id);
    
    // Check if linked to products
    const linkedProducts = await this.prisma.product.count({ where: { brandId: id } });
    if (linkedProducts > 0) {
      throw new BadRequestException('Cannot delete a brand that has associated products');
    }

    return this.prisma.brand.delete({ where: { id } });
  }
}
