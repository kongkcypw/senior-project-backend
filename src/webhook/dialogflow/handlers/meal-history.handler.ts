import { Injectable } from "@nestjs/common";
import { messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { MealHistoryService } from "src/nutrition/services/meal-history.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { MealHistoryMessage, MealHistoryMealItem, MealHistoryIntake } from "../messages/meal-history.message";

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

function formatThaiDate(date: Date): string {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
}

function formatThaiDateRange(startDate: Date, endDateExclusive: Date): string {
    // Dialogflow endDate is exclusive — subtract 1 day to get the last visible day
    const endDate = new Date(endDateExclusive.getTime() - 24 * 60 * 60 * 1000);

    const sameDay =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

    if (sameDay) {
        return formatThaiDate(startDate);
    }

    const sameMonth =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth();

    if (sameMonth) {
        const year = startDate.getFullYear() + 543;
        return `${startDate.getDate()} - ${endDate.getDate()} ${THAI_MONTHS[startDate.getMonth()]} ${year}`;
    }

    return `${formatThaiDate(startDate)} - ${formatThaiDate(endDate)}`;
}

function parseDatePeriod(parameters: any): { startDate: Date; endDate: Date; label: string } {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const datePeriodField = parameters?.fields?.['date-period'];

    if (!datePeriodField || datePeriodField.kind === 'nullValue' || !datePeriodField.structValue) {
        return {
            startDate: todayStart,
            endDate: tomorrowStart,
            label: formatThaiDate(todayStart),
        };
    }

    const startStr: string | undefined = datePeriodField.structValue?.fields?.startDate?.stringValue;
    const endStr: string | undefined = datePeriodField.structValue?.fields?.endDate?.stringValue;

    if (!startStr || !endStr) {
        return {
            startDate: todayStart,
            endDate: tomorrowStart,
            label: formatThaiDate(todayStart),
        };
    }

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    return { startDate, endDate, label: formatThaiDateRange(startDate, endDate) };
}

@Injectable()
export class MealHistoryHandler {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly mealHistoryService: MealHistoryService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
    ) { }

    async handlePersonalChat(event: any, parameters?: any): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const { startDate, endDate, label } = parseDatePeriod(parameters);
        console.log(`Parsed date period for MealHistory: start=${startDate.toISOString()}, end=${endDate.toISOString()}, label=${label}`);
        const seeMoreUrl = this.lineLiffNavigatePathService.getNutritionInDayPage(userId);

        const meals = await this.mealHistoryService.findMealsByDateRange(userId, startDate, endDate);

        if (meals.length === 0) {
            const noMealsMessage: messagingApi.Message[] = [{
                type: "flex",
                altText: `ไม่พบรายการอาหาร วันที่ ${label}`,
                contents: {
                    type: "bubble",
                    body: {
                        type: "box",
                        layout: "vertical",
                        paddingAll: "16px",
                        backgroundColor: "#F3F3F3",
                        cornerRadius: "xxl",
                        contents: [
                            {
                                type: "text",
                                text: `วันที่ ${label}`,
                                size: "lg",
                                weight: "bold",
                                color: "#4270ED",
                                wrap: true,
                            },
                            {
                                type: "text",
                                text: "ไม่พบรายการอาหารที่บันทึกไว้ในช่วงเวลานี้",
                                size: "md",
                                color: "#555555",
                                wrap: true,
                                margin: "sm",
                            },
                        ],
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        paddingAll: "12px",
                        backgroundColor: "#F3F3F3",
                        contents: [
                            {
                                type: "button",
                                style: "primary",
                                color: "#4270ED",
                                height: "sm",
                                action: { type: "uri", label: "บันทึกอาหาร", uri: seeMoreUrl },
                            },
                        ],
                    },
                },
            }];
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, noMealsMessage);
            return;
        }

        const intake: MealHistoryIntake = {
            calories: meals.reduce((sum, m) => sum + m.calories, 0),
            carbohydrate: meals.reduce((sum, m) => sum + m.carbohydrate, 0),
            protein: meals.reduce((sum, m) => sum + m.protein, 0),
            fat: meals.reduce((sum, m) => sum + m.fat, 0),
        };

        const mealItems: MealHistoryMealItem[] = meals.map(m => ({
            mealName: m.foodTitle,
            imageUrl: m.imageUrl ?? '',
            detailUrl: this.lineLiffNavigatePathService.getMealDetailPage(userId, m.id.toString()),
            calories: m.calories,
            carbohydrate: m.carbohydrate,
            protein: m.protein,
            fat: m.fat,
        }));

        const payload = MealHistoryMessage(label, seeMoreUrl, intake, mealItems);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
