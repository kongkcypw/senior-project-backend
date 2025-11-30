import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserBodyInformationController } from "./controllers/user-body-information.controller";

@Module({
    imports: [],
    providers: [
        UserRepository,
        UserService
    ],
    controllers: [
        UserController,
        UserBodyInformationController
    ],
    exports: [UserService]
})

export class UserModule {}