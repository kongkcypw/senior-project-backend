import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToInstance } from "class-transformer";
import { MealHistoryEntity } from "../entities/meal-history.entity";

export class MealDetailDto {

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    lineUserId: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    @ApiProperty()
    @Expose()
    foodTitle: string;

    @ApiProperty()
    @Expose()
    calories: number;

    @ApiProperty()
    @Expose()
    protein: number;

    @ApiProperty()
    @Expose()
    carbohydrate: number;

    @ApiProperty()
    @Expose()
    fat: number;

    @ApiProperty()
    @Expose()
    ingredients: any[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    confirmAt: Date | null;

    static fromEntityToDto(rawData: MealHistoryEntity): MealDetailDto {
        const transformedDto = plainToInstance(MealDetailDto, rawData);
        return transformedDto;
    }
}