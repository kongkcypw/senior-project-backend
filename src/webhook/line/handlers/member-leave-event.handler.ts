import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { MemberLeaveEvent, messagingApi } from "@line/bot-sdk";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class MemberLeaveEventHandler implements EventHandler<MemberLeaveEvent> {

    constructor(
        private readonly lineGroupMemberService: LineGroupMemberService,
    ){}

    async handle(event: MemberLeaveEvent): Promise<void> {
        console.log('Handling Member leave Event:', event);
        await this.processMemberLeaveEvent(event);
    }

    async processMemberLeaveEvent(event: MemberLeaveEvent): Promise<void | messagingApi.Message[]> {
        const { source } = event;
        const sourceType = source.type
        // return early if not a group
        if(sourceType !== 'group') {
            console.log('Member leave event source is not a group. No action taken.');
            return;
        }
        const groupId = source.groupId;
        const members = event.left.members;

        // Mark each member as left in database
        for(const member of members) {
            const lineUserId = member.userId;
            await this.lineGroupMemberService.markMemberAsLeft(groupId, lineUserId);
        }
    }
}