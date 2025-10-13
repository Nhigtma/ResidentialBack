import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe)
    app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });
  const config = new DocumentBuilder()
    .setTitle('Residential')
    .setDescription('Description and information on the use of each endpoint')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/reference',
    apiReference({
      theme: 'default',
        content: document,
    }),
  );
  await app.listen(Number(process.env.PORT));
}
bootstrap();
