import { Profile } from "../profile/profile.model";
import { Message } from "./ensembles-chat/message.model";
import { Member } from "./member.model";

export class Ensemble {
    constructor(
        public name: string,
        public date: string,
        public time: string,
        public description: string,
        public size: number,
        public instrumentsNeeded: Object[],
        public instrumentsHave: Object[],
        public genre: string,
        public location: string,
        public members: Member[],
        public chat: Message[] = [new Message(null, 'aaa')],
    ) {}
}