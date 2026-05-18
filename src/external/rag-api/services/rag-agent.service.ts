import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { RagApiConfigService } from "./config.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

export interface PhysiquePayload {
    age: number;
    height_cm: number;
    weight_kg: number;
    body_fat_percentage: number | null;
    goal: string | null;
}

export interface GeneratedExerciseSet {
    set: number;
    rep: number;
    weight_kg: number | null;
}

export interface GeneratedExercise {
    name: string;
    description: string;
    order: number;
    sets: GeneratedExerciseSet[];
}

export interface GeneratedRoutine {
    name: string;
    order: number;
    exercises: GeneratedExercise[];
}

export interface GeneratedProgram {
    program_name: string;
    routines: GeneratedRoutine[];
}

@Injectable()
export class RagAgentService {
    constructor(
        private readonly ragApiConfigService: RagApiConfigService,
        private readonly httpService: HttpService,
    ) { }

    async getRAGResponse(message: string, line_user_id: string, role: string): Promise<{
    message: string;
    gemini_call_count: number;
    }> {
        try {
            const url = `${this.ragApiConfigService.ragApiUrl}/agent`;
            const observable = this.httpService.post(url, {
                message,
                line_user_id,
                user_role: role,
            });
            const response = await lastValueFrom(observable);
            return {
                message: response.data.response,
                gemini_call_count: response.data.gemini_call_count
            };
        } catch (error) {
            console.error('Error getting RAG response:', error);
            return {
                message: 'ขุนพันธ์ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งภายหลังครับ',
                gemini_call_count: 0
            };
        }
    }

    async generateWorkoutProgram(lineUserId: string, physique: PhysiquePayload): Promise<GeneratedProgram> {
        try {
            const url = `${this.ragApiConfigService.ragApiUrl}/generate-workout-program`;
            const observable = this.httpService.post(url, {
                line_user_id: lineUserId,
                physique,
            });
            const response = await lastValueFrom(observable);
            return response.data as GeneratedProgram;
        } catch (error) {
            console.error('Error generating workout program:', error);
            throw new ServiceUnavailableException('AI service is currently unavailable. Please try again later.');
        }
    }
}