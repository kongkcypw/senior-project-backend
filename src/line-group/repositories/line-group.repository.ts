import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LineGroupEntity } from "../entities/line-groups.entity";

@Injectable()
export class LineGroupRepository extends Repository<LineGroupEntity> {
    constructor(private datasource: DataSource){
        super(LineGroupEntity, datasource.createEntityManager());
    }

    async findByGroupId(groupId: string): Promise<LineGroupEntity | null> {
        return this.findOne({ where: { groupId } });
    }
    
}