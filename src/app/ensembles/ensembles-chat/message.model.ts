import { Profile } from "../../profile-creation/profile.model";

export class Message {
    constructor(
        public profile: Profile,
        public message: string
    ) {}
}