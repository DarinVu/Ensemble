import { Ensemble } from "../ensembles/ensemble.model";

export class Profile {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public instruments: string[],
        public videos?: string[],
        public recordings?: any,
        public bio?: string,
        public ensembles: Ensemble[] = []
    ) {}
}