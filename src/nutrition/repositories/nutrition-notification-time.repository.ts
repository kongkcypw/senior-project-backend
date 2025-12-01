import { Injectable } from "@nestjs/common";
import { NutritionNotificationTimeEntity } from "../entities/nutrition-notification-time.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class NutritionNotificationTimeRepository extends Repository<NutritionNotificationTimeEntity>  {
    constructor(datasource: DataSource){
        super(NutritionNotificationTimeEntity, datasource.createEntityManager());
    }

    async findByTimeWithPlan(time: string): Promise<NutritionNotificationTimeEntity[]> {
        return this.createQueryBuilder("notificationTime")
            .leftJoinAndSelect("notificationTime.nutritionPlan", "nutritionPlan")
            .where("notificationTime.sendAt = :time", { time })
            .getMany();
    }
}