import { Injectable } from "@nestjs/common";
import { DialogflowClientService } from "src/external/dialogflow-client/services/client.service";
import { DialogflowConfigService } from "src/external/dialogflow-client/services/config.service";

@Injectable()
export class DialogflowFindTuneService {
    constructor(
        private readonly dialogflowClientService: DialogflowClientService,
        private readonly dialogflowConfigService: DialogflowConfigService,
    ) { }

    async getDialogflowIntentAndConfidence(queryInputText: string): Promise<{
        intentName: string | null,
        intentDetectionConfidence: number | null | undefined
    } | null | undefined> {
        try {
            const dialogflowClient = this.dialogflowClientService.createSessionsClient();
            const sessionPath = dialogflowClient.projectAgentSessionPath(
                this.dialogflowConfigService.projectId,
                'default-session',
            )

            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: queryInputText,
                        languageCode: 'th',
                    },
                },
            };

            const responses = await dialogflowClient.detectIntent(request);
            const result = responses[0].queryResult;

            // console.log(JSON.stringify(result, null, 2));

            if (!result || !result.intent) {
                return null;
            }

            if (result.parameters) {
                const parameters = result.parameters.fields;
                // console.log('Extracted Parameters:', parameters);
            }

            if (result.intent.displayName) {
                return {
                    intentName: result.intent.displayName,
                    intentDetectionConfidence: result.intentDetectionConfidence
                };
            }

            return null;


        } catch (error) {
            console.error('Error handling Dialogflow text event:', error);
        }
    }
}