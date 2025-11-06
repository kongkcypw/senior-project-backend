import { Module } from "@nestjs/common";
import { NotificationScheduleRepository } from "./repositories/notification-schedule.repository";

@Module({
    imports: [],
    providers: [NotificationScheduleRepository],
    controllers: [],
})

export class NotificationModule {}