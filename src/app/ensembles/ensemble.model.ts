import { Profile } from "../profile-creation/profile.model";
import { Message } from "./ensembles-chat/message.model";
import { Member } from "./member.model";

export class Ensemble {
    constructor(
        public name: string,
        public date: string,
        public time: string,
        public description: string,
        public size: number,
        public instruments: string[],
        public genre: string,
        public status: string,
        public members: Member[],
        public chat: Message[] = [new Message(null, 'aaa')],
    ) {}
}