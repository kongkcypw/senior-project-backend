import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { UserRole } from "../enums/user-role.enum";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private datasource: DataSource){
        super(UserEntity, datasource.createEntityManager());
    }

    async findByLineUserId(lineUserId: string): Promise<UserEntity | null> {
        return this.findOne({ where: { lineUserId } });
    }

    async findByLineUserIdAndRole(lineUserId: string, role: UserRole): Promise<UserEntity | null> {
        return this.findOne({ where: { lineUserId, role } });
    }
}