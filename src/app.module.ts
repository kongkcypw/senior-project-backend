import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { CommonConfigModule } from './common/config/common-config.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './users/user.module';
import { LineGroupModule } from './line-group/line-group.module';
import { NotificationModule } from './notification/notification.module';
import { HttpModule } from '@nestjs/axios';
import { LineMessagingApiModule } from './external/line-messaging-api/line-messaging-api.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NutritionModule } from './nutrition/nutrition.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CommonConfigModule,
    HttpModule,
    LineMessagingApiModule,
    WebhookModule, 
    UserModule,
    LineGroupModule,
    NotificationModule,
    NutritionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
