import { Injectable } from "@nestjs/common";
import { DataSource, IsNull, Repository } from "typeorm";
import { UserRelationshipEntity } from "../entities/user-relationships.entity";

@Injectable()
export class UserRelationshipsRepository extends Repository<UserRelationshipEntity> {
    constructor(private dataSource: DataSource) {
        super(UserRelationshipEntity, dataSource.createEntityManager());
    }

    async findActiveRelationshipsByTraineeAndTrainer(traineeLineUserId: string, trainerLineUserId: string): Promise<UserRelationshipEntity | null> {
        return this.findOne({ 
            where: {
                traineeLineUserId, 
                trainerLineUserId,
                isActive: true,
                unassignedAt: IsNull()
            }
        });
    }
}