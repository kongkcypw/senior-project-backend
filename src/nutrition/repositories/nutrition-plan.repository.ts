import { Injectable } from "@nestjs/common";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class NutritionPlanRepository extends Repository<NutritionPlanEntity>  {
    constructor(private datasource: DataSource){
        super(NutritionPlanEntity, datasource.createEntityManager());
    }
}