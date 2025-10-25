import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { CommonConfigModule } from './common/config/common-config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonConfigModule,
    WebhookModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
