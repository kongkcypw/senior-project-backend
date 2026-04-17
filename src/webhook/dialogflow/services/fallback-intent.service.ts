import { MessageEvent } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { RagAgentService } from "src/external/rag-api/services/rag-agent.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { UserService } from "src/users/services/user.service";
import { FeatureRateLimitService } from "src/feature-rate-limit/services/feature-rate-limit.service";
import { FeatureRateLimitKey } from "src/feature-rate-limit/enums/feature-rate-limit.enum";

@Injectable()
export class FallbackIntentService {
    constructor(
        private readonly ragAgentService: RagAgentService,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly userService: UserService,
        private readonly featureRateLimitService: FeatureRateLimitService,
    ) { }

    async handleFallbackIntent(message: string, event: MessageEvent): Promise<void> {

        console.log('Handling fallback intent, Use RAG API for message:', message);

        // const groupId = event.source.type === 'group' ? event.source.groupId : null;
        const userId = event.source.userId;

        if (!userId) {
            return;
        }

        const user = await this.userService.findByLineUserId(userId);
        if (!user || !user.role) {
            return;
        }

        const ragResponse = await this.ragAgentService.getRAGResponse(message, userId, user.role);

        if (ragResponse.gemini_call_count > 0) {
            await this.featureRateLimitService.incrementUsage(FeatureRateLimitKey.RAG_LLM_SERVICE, ragResponse.gemini_call_count);
        }

        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
            {
                type: 'text',
                text: ragResponse.message,
            }
        ]);
    }
}