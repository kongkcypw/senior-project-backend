import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserPhysiqueHistoryController } from "./controllers/user-physique-history.controller";
import { UserRelationshipsRepository } from "./repositories/user-relationships.repository";
import { UserRelationshipsService } from "./services/user-relationships.service";
import { UserRelationshipsController } from "./controllers/user-relationships.controller";
import { UserPhysiqueHistoryRepository } from "./repositories/user-physique-history.repository";
import { UserPhysiqueHistoryService } from "./services/user-physique-history.service";
import { LineGroupModule } from "src/line-group/line-group.module";

@Module({
    imports: [
        LineGroupModule,
    ],
    providers: [
        UserRepository,
        UserService,
        UserRelationshipsRepository,
        UserRelationshipsService,
        UserPhysiqueHistoryRepository,
        UserPhysiqueHistoryService,
    ],
    controllers: [
        UserController,
        UserRelationshipsController,
        UserPhysiqueHistoryController,
    ],
    exports: [UserService, UserRelationshipsService]
})

export class UserModule {}