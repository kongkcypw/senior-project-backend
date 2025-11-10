import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { LeaveEvent } from "@line/bot-sdk";
import { LineGroupService } from "src/line-group/services/line-group.service";

@Injectable()
export class LeaveEventHandler implements EventHandler<LeaveEvent> {

    constructor(
        private readonly lineGroupService: LineGroupService,
    ){}

    async handle(event: LeaveEvent): Promise<void> {
        console.log('Handling Leave Event:', event);
        await this.processLeaveEvent(event);
    }

    async processLeaveEvent(event: LeaveEvent): Promise<void> {
        const { source } = event;
        const sourceType = source.type
        // return early if not a group
        if(sourceType !== 'group') {
            console.log('Leave event source is not a group. No action taken.');
            return;
        }
        const groupId = source.groupId;

        // Mark group as left in database
        await this.lineGroupService.markGroupAsLeft(groupId);
    }
}