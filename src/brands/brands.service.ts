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

  async create(dto: CreateBrandDto) {
    const slug = slugify(dto.name);
    
    // Check uniqueness
    const existing = await this.prisma.brand.findFirst({
      where: {
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
      }
    });
  }

  async findAll(search?: string) {
    const where: any = {};
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

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: number, dto: UpdateBrandDto) {
    await this.findOne(id);
    
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

  async remove(id: number) {
    await this.findOne(id);
    
    // Check if linked to products
    const linkedProducts = await this.prisma.product.count({ where: { brandId: id } });
    if (linkedProducts > 0) {
      throw new BadRequestException('Cannot delete a brand that has associated products');
    }

    return this.prisma.brand.delete({ where: { id } });
  }
}
