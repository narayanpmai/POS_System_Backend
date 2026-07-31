import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  // Serve static uploads (category images, etc.)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Middleware to support both /api/v1/* prefixed and unprefixed routes
  app.use((req: any, res: any, next: any) => {
    if (req.url.startsWith('/api/v1/')) {
      req.url = req.url.replace('/api/v1', '');
    } else if (req.url === '/api/v1') {
      req.url = '/';
    }
    next();
  });

  // Enable CORS for frontend connectivity
  app.enableCors({
    origin: (origin, callback) => callback(null, true),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Register global HTTP logging interceptor and exception filter
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable global DTO validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 8001;

  // Setup Swagger API Documentation (Disabled if ENABLE_SWAGGER=false)
  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Koselighar API')
      .setDescription('Production-Ready Backend API for Koselighar System')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log(`API Swagger Documentation: http://localhost:${port}/api/docs`);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Koselighar Backend running on: http://localhost:${port}`);
}
bootstrap();
