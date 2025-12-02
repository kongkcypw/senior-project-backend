import { Controller, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";

@Controller('workout-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutHistoryController {
    constructor() {}
}