import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AppInitService } from './providers/initialiser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Store Front')
    .setDescription('Store Front API Documentation')
    .setVersion('1.0')
    .addTag('storefront')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(helmet());

  await app.listen(3000);
  const appService = app.get(AppInitService);
  appService.initialize();
}
bootstrap();
