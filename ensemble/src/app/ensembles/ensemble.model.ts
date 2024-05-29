export class Ensemble {
    constructor(
        public name: string,
        public date: string,
        public time: string,
        public description: string,
        public size: number,
        public instruments: string[],
        public genre: string,
        public status: string
    ) {}
}