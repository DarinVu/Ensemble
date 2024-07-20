import { Profile } from "../../profile/profile.model";

export class Message {
    constructor(
        public profile: Profile,
        public message: string
    ) {}
}