import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend connectivity (multi-tenant: allow all subdomains + explicit allowlist)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'koshelighar.com';
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];
  const explicitOrigins = [
    ...envOrigins,
    process.env.FRONTEND_URL,
    'https://koselighar.smartptrm.com',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow explicit origins from env
      if (explicitOrigins.includes(origin)) return callback(null, true);
      // Allow localhost:3000 and any subdomain of localhost
      if (origin === 'http://localhost:3000' || /^http:\/\/[a-z0-9-]+\.localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Allow production root domain and all its subdomains
      if (origin === `https://${rootDomain}` || origin.endsWith(`.${rootDomain}`)) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
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
