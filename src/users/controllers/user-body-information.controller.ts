import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { getProtectedGuards } from "src/utils/guards.util";
import { UserRole } from "../enums/user-role.enum";

@Controller('user-body-information')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class UserBodyInformationController {
    constructor() { }

    @Get()
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    getBodyInformation(): any[] {
        return [
            { id: 1, lineUserId: "user123", age: 25, weight: 70.5, height: 175.0, bodyFatPercentage: 20.0, fitnessGoal: "ลดน้ำหนัก 5 กก.", createdAt: "2024-01-15", updatedAt: "2024-01-15" },
            { id: 2, lineUserId: "user123", age: 26, weight: 68.0, height: 175.0, bodyFatPercentage: 18.5, fitnessGoal: "เพิ่มกล้ามเนื้อ", createdAt: "2024-06-10", updatedAt: "2024-06-10" },
            { id: 3, lineUserId: "user123", age: 26, weight: 69.0, height: 175.0, bodyFatPercentage: null, fitnessGoal: "วิ่งมาราธอน", createdAt: "2024-12-01", updatedAt: "2024-12-01" },
        ]
    }
}