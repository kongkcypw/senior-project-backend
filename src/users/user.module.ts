import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [],
    providers: [
        UserRepository,
        UserService
    ],
    controllers: [
        UserController
    ],
    exports: [UserService]
})

export class UserModule {}