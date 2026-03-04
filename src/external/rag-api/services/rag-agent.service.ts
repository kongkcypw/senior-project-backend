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

    async getRAGResponse(message: string, line_user_id: string, role: string): Promise<string> {
        try {
            const url = `${this.ragApiConfigService.ragApiUrl}/agent`;
            const observable = this.httpService.post(url, {
                message,
                line_user_id,
                user_role: role,
            });
            const response = await lastValueFrom(observable);
            return response.data.response;
        } catch (error) {
            console.error('Error getting RAG response:', error);
            return 'ขออภัย ไม่สามารถเชื่อมต่อกับระบบ RAG ได้ในขณะนี้';
        }
    }
}