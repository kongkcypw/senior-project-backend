import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationScheduleEntity } from "../entities/notification-schedule.entity";
import { NotificationScheduleSendInterval } from "../enums/send-interval.enum";
import { NotificationScheduleType } from "../enums/notification-schedule-type.enum";

@Injectable()
export class NotificationScheduleRepository extends Repository<NotificationScheduleEntity> {
    constructor(private datasource: DataSource){
        super(NotificationScheduleEntity, datasource.createEntityManager());
    }

    async findCaloriesIntakeReminderByTime(time: string): Promise<NotificationScheduleEntity[]> {
        return this.createQueryBuilder("ns")
            .leftJoinAndSelect("ns.userCaloriesPlans", "userPlans", 
                "userPlans.needNotification = true",
            )
            .where("ns.type = :type", { type: NotificationScheduleType.CALORIES_INTAKE_REMINDER })
            .andWhere("ns.sendInterval = :DAILY", { DAILY: NotificationScheduleSendInterval.DAILY })
            .andWhere("CAST(ns.sendAt AS time) = :time", { time })
            .getMany();
    }
}