// user-physique.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // Optional: Use for documentation/validation
import { UserPhysiqueHistoryEntity } from '../entities/user-physique-history.entity';

export class UserPhysiqueDto {
    @ApiProperty({ description: 'The unique ID of the physique history record.' })
    id: number;

    @ApiProperty({ description: 'The LINE user ID associated with the history record.' })
    lineUserId: string;

    @ApiProperty({ description: 'The user\'s age at the time of the measurement.' })
    age: number;

    @ApiProperty({ description: 'The user\'s current weight in kilograms (kg).' })
    weight: number;

    @ApiProperty({ description: 'The user\'s height in centimeters (cm).' })
    height: number;

    @ApiProperty({ description: 'The user\'s body fat percentage. Nullable.', required: false, nullable: true })
    bodyFatPercentage: number | null | undefined;

    @ApiProperty({ description: 'The user\'s fitness goal.', required: false })
    goal: string;
    
    // Note: Frontend interface uses string for dates, so we'll use string here
    @ApiProperty({ description: 'The timestamp when this record was created (ISO format string).' })
    createdAt: string;

    @ApiProperty({ description: 'The timestamp when this record was last updated (ISO format string).' })
    updatedAt: string;

    /**
     * Factory method to convert an Entity to a DTO.
     * This ensures the column names match the DTO/frontend interface.
     */
    static fromEntity(entity: UserPhysiqueHistoryEntity): UserPhysiqueDto {
        const dto = new UserPhysiqueDto();
        dto.id = entity.id;
        dto.lineUserId = entity.lineUserId;
        dto.age = entity.age;
        // Map entity column name (weightKg, heightCm) to DTO property name (weight, height)
        dto.weight = entity.weightKg;
        dto.height = entity.heightCm;
        dto.bodyFatPercentage = entity.bodyFatPercentage;
        dto.goal = entity.goal;
        // Convert Date objects to ISO string format as required by frontend interface
        dto.createdAt = entity.createdAt.toISOString();
        dto.updatedAt = entity.updatedAt.toISOString();
        return dto;
    }
}