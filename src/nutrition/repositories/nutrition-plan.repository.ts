import { Injectable } from "@nestjs/common";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class NutritionPlanRepository extends Repository<NutritionPlanEntity>  {
    constructor(private datasource: DataSource){
        super(NutritionPlanEntity, datasource.createEntityManager());
    }

    async findByLineUserId(lineUserId: string): Promise<NutritionPlanEntity | null> {
        return this.createQueryBuilder("nutritionPlan")
            .where("nutritionPlan.lineUserId = :lineUserId", { lineUserId })
            .leftJoinAndSelect("nutritionPlan.notificationTimes", "notificationTime")
            .getOne();
    }
}