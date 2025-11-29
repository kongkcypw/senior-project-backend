import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Part } from '@google/genai';
import { PROMPT_FOOD_IMAGE_ANALYSIS_THAI } from '../constants/promt-food-image-analysis.constant';
import { AnalyzeFoodImageResponse } from '../types/gemini-analyze-food-image-response.type';

@Injectable()
export class GeminiService {
    private ai: GoogleGenAI;
    private model = 'gemini-2.5-flash'; // Good balance of speed and capability

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    // Utility function to convert a buffer to a Part object for the API
    private fileToGenerativePart(buffer: Buffer, mimeType: string): Part {
        return {
            inlineData: {
                data: buffer.toString('base64'),
                mimeType,
            },
        };
    }

    // The main analysis method will be here
    async analyzeFoodImage(imageBuffer: Buffer, mimeType: string): Promise<AnalyzeFoodImageResponse | null> {
        const imagePart = this.fileToGenerativePart(imageBuffer, mimeType);

        const prompt = PROMPT_FOOD_IMAGE_ANALYSIS_THAI;
        const contents = [imagePart, { text: prompt }];

        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: contents,
            config: {
                responseMimeType: 'application/json',
            }
        });

        if(!response.text){
            throw new Error("No response from Gemini model.");
        }

        try {
            const rawJson = response.text.trim();
            // The response.text should be a clean JSON string based on the prompt
            const analysisData = JSON.parse(rawJson);

            // Now you can apply your logic:
            if (analysisData.is_food) {
                // Return the full analysis
                return {
                    message: "Food analysis successful.",
                    data: analysisData,
                };
            } else {
                // Return the "not food" message
                return {
                    message: analysisData.analysis_result || "The image does not appear to be food.",
                    data: analysisData, // Can return data for consistency, even if mostly null
                };
            }

        } catch (e) {
            console.error("Error parsing Gemini response:", e);
            return null;
        }
    }
}