import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "dotenv";
import { ConfigService } from '@nestjs/config';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import dataSource from 'db/data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();

const configService = new ConfigService();

async function bootstrap() {

  // Initialize async storage for transactions
  initializeTransactionalContext(); 

  // Ensure DataSource is connected before registering
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    console.log('DataSource initialized');
  }

  // Register your TypeORM DataSource
  addTransactionalDataSource(dataSource);

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Senior Project API') 
    .setDescription('API documentation for Senior Project') 
    .setVersion('1.0') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);

  await app.listen( configService.getOrThrow<number>('PORT') || 9000, '0.0.0.0');
}
bootstrap();
