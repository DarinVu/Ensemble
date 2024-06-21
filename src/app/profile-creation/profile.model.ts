import { Ensemble } from "../ensembles/ensemble.model";
import { Request } from "../inbox/request.model";

export class Profile {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public instruments: string[],
        public ensembles: Ensemble[],
        public videos?: string[],
        public recordings?: any,
        public bio?: string,
        public requests: Request[] = [new Request(null, null, null, null, null, 'aaa')]
    ) {}
}