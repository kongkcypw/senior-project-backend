import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MealHistoryEntity } from "../entities/meal-history.entity";

@Injectable()
export class MealHistoryRepository extends Repository<MealHistoryEntity> {
    constructor(private datasource: DataSource){
        super(MealHistoryEntity, datasource.createEntityManager());
    }

    async findMealProgressOfDayById(id: number): Promise<MealHistoryEntity | null> {
        return this.findOne({
            where: {
                id
            }
        })
    }
}