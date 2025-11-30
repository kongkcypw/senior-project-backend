import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserPhysiqueHistoryEntity } from "../entities/user-physique-history.entity";

@Injectable()
export class UserPhysiqueHistoryRepository extends Repository<UserPhysiqueHistoryEntity> {
    constructor(private datasource: DataSource) {
        super(UserPhysiqueHistoryEntity, datasource.createEntityManager());
    }

    async findByLineUserId(lineUserId: string): Promise<UserPhysiqueHistoryEntity[]> {
        return this.find({ where: { lineUserId } });
    }
}