import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LineGroupChatHistoryEntity } from "../entities/line-group-chat-history.entity";

@Injectable()
export class LineGroupChatHistoryRepository extends Repository<LineGroupChatHistoryEntity> {
    constructor(private datasource: DataSource){
        super(LineGroupChatHistoryEntity, datasource.createEntityManager());
    }
}