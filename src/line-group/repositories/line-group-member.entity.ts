import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LineGroupMemberEntity } from "../entities/line-group-member.entity";

@Injectable()
export class LineGroupMemberRepository extends Repository<LineGroupMemberEntity> {
    constructor(private datasource: DataSource){
        super(LineGroupMemberEntity, datasource.createEntityManager());
    }
}