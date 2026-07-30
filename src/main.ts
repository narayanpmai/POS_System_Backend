import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Koselighar API')
    .setDescription('Production-Ready Backend API for Koselighar System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8001;
  await app.listen(port, '0.0.0.0');
  console.log(`Koselighar Backend running on: http://localhost:${port}`);
  console.log(`API Swagger Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
