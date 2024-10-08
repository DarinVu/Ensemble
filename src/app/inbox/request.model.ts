import { Ensemble } from "../ensembles/ensemble.model";
import { Profile } from "../profile/profile.model";

export class Request {
    constructor(
        public profileId: string,
        public firstName: string,
        public lastName: string,
        public ensembleId: string,
        public ensembleName: string,
        public profilePic: string,
        public instrument: string,
        public requestsSent: string[],
        public message?: string
    ) {}
}