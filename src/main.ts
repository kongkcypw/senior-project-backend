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

  const frontendBaseUrl = configService.get<string>('FRONTEND_BASE_URL');
  const frontendDashboardBaseUrl = configService.get<string>('FRONTEND_DASHBOARD_BASE_URL');
  app.enableCors({
    origin: [frontendBaseUrl, frontendDashboardBaseUrl],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Senior Project API')
    .setDescription('API documentation for Senior Project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);

  const port = configService.getOrThrow<number>('PORT') || 9000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
