import { Ensemble } from "../ensembles/ensemble.model";

export class Request {
    constructor(
        public profileId: string,
        public ensembleId: string,
        public message?: string
    ) {}
}