export class Profile {
    constructor(
        public email: string,
        public name: string,
        public instruments: string[],
        public videos: string[],
        public recordings: any,
        public bio?: string
    ) {}
}