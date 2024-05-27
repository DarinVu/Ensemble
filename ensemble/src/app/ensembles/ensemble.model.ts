export class Ensemble {
    constructor(
        public name: string,
        public description: string,
        public size: number,
        public instruments: string[],
        public genre: string,
        public status: string
    ) {}
}