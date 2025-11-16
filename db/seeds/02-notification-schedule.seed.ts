import { NotificationScheduleEntity } from "src/notification/entities/notification-schedule.entity";
import { NotificationScheduleType } from "src/notification/enums/notification-schedule-type.enum";
import { NotificationScheduleSendInterval } from "src/notification/enums/send-interval.enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class MockNotificationSchedule {
    static readonly NOTIFICATION_SCHEDULE_001: NotificationScheduleEntity = {
        id: 1,
        type: NotificationScheduleType.CALORIES_INTAKE_REMINDER,
        sendInterval: NotificationScheduleSendInterval.DAILY,
        sendAt: '16:20:00',
        createdAt: new Date(),
        updatedAt: new Date(),
        userCaloriesPlans: [],
    };
    static readonly NotificationSchedules = [
        this.NOTIFICATION_SCHEDULE_001,
    ]
}

export default class MockNotificationScheduleSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(NotificationScheduleEntity);

        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )

        await repository.save(MockNotificationSchedule.NotificationSchedules);
    }
}