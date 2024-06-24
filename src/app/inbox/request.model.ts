import { Ensemble } from "../ensembles/ensemble.model";
import { Profile } from "../profile-creation/profile.model";

export class Request {
    constructor(
        public profileId: string,
        public firstName: string,
        public lastName: string,
        public ensembleId: string,
        public ensembleName: string,
        public message?: string
    ) {}
}