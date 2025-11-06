import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationScheduleEntity } from "../entities/notification-schedule.entity";

@Injectable()
export class NotificationScheduleRepository extends Repository<NotificationScheduleEntity> {
    constructor(private datasource: DataSource){
        super(NotificationScheduleEntity, datasource.createEntityManager());
    }
}