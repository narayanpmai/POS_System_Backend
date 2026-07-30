import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController, CategoriesController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
