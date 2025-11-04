import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UsersEntity } from "../entities/users.entity";

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
    constructor(private datasource: DataSource){
        super(UsersEntity, datasource.createEntityManager());
    }

    async findByLineUserId(id: string): Promise<UsersEntity | null> {
        return this.findOne({ where: { lineUserId: id } });
    }
}