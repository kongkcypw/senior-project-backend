import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private datasource: DataSource){
        super(UserEntity, datasource.createEntityManager());
    }

    async findByLineUserId(id: string): Promise<UserEntity | null> {
        return this.findOne({ where: { lineUserId: id } });
    }
}