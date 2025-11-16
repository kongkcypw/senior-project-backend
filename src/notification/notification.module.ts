import { Module } from "@nestjs/common";
import { NotificationScheduleRepository } from "./repositories/notification-schedule.repository";
import { NotificationScheduleService } from "./services/notification-schedule.service";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { LineGroupModule } from "src/line-group/line-group.module";

@Module({
    imports: [LineMessagingApiModule, LineGroupModule],
    providers: [NotificationScheduleRepository, NotificationScheduleService],
    controllers: [],
})

export class NotificationModule {}