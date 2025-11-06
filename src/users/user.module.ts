import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/users.service";
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
})

export class UserModule {}