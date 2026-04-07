import { Injectable } from "@nestjs/common";
import { DataSource, IsNull, Repository } from "typeorm";
import { UserRelationshipEntity } from "../entities/user-relationships.entity";

@Injectable()
export class UserRelationshipsRepository extends Repository<UserRelationshipEntity> {
    constructor(private dataSource: DataSource) {
        super(UserRelationshipEntity, dataSource.createEntityManager());
    }

    async findActiveRelationshipsByTraineeAndTrainer(trainerLineUserId: string, traineeLineUserId: string): Promise<UserRelationshipEntity | null> {
        return this.findOne({
            where: {
                trainerLineUserId,
                traineeLineUserId,
                isActive: true,
            }
        });
    }

    async findActiveRelationshipsByTrainee(traineeLineUserId: string): Promise<UserRelationshipEntity | null> {
        return this.findOne({
            where: {
                traineeLineUserId,
                isActive: true,
            }
        });
    }
}