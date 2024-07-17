import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FiltersService {
    sizeFilter = new Subject<number>();
    hugeEnsembleFilter = new Subject<boolean>();
    genreFilter = new Subject<string>();
    instrumentFilter = new Subject<string>();
    filtersChange = new Subject<boolean>();

    setSizeFilter(size: number) {
        this.sizeFilter.next(size)
    }

    setHugeEnsembleFilter(status: boolean) {
        this.hugeEnsembleFilter.next(status);
    }

    setGenreFilter(genre: string) {
        this.genreFilter.next(genre);
    }

    setInstrumentFilter(instrument: string) { 
        this.instrumentFilter.next(instrument);
    }

    notifyFiltersChange() {
        this.filtersChange.next(true)
    }

}