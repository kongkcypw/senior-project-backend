import { Injectable } from "@nestjs/common";
import { RagApiConfigService } from "./config.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

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
}