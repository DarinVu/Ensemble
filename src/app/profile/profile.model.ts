import { EnsembleShort } from "../ensembles/ensembleShort.model";
import { Request } from "../inbox/request.model";

export class Profile {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public instruments: string[],
        public ensembles: EnsembleShort[],
        public recordings?: string[],
        public bio?: string,
        public profilePic?: any,
        public requestsReceived: Request[] = [new Request(null, null, null, null, null, null, 'placeholder', null)],
        public requestsSent: string[] = ['placeholder']
    ) {}
}