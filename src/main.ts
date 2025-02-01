import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my NestJS project')
    .setVersion('1.0')
    .addBearerAuth() // Optional: Add authentication support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at `/api`
  app.enableCors({
    origin: '*', // You can specify specific origins instead of '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
