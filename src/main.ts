import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend connectivity
  const frontendUrl = process.env.FRONTEND_URL || '';
  const origins = [
    'http://localhost:3000',
    'https://koselighar.smartptrm.com',
    'http://koselighar.smartptrm.com',
  ];

  if (frontendUrl) {
    const customOrigins = frontendUrl.split(',').map((url) => url.trim());
    customOrigins.forEach((origin) => {
      if (origin && !origins.includes(origin)) {
        origins.push(origin);
      }
    });
  }

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global DTO validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('SmartPOS API')
    .setDescription('Production-Ready POS API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`SmartPOS Backend running on: http://localhost:${port}`);
  console.log(`API Swagger Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
