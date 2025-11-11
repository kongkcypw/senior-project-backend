import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "dotenv";
import { ConfigService } from '@nestjs/config';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import dataSource from 'db/data-source';

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
  await app.listen( configService.getOrThrow<number>('PORT') || 9000, '0.0.0.0');
}
bootstrap();
