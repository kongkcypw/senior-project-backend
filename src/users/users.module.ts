import { Module } from "@nestjs/common";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";

@Module({
    imports: [],
    providers: [
        UsersRepository,
        UsersService
    ],
    controllers: [
        UsersController
    ],
})

export class UsersModule {}