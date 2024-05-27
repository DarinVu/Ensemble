import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnsemblesSerivce } from "./ensembles.service";
import { Ensemble } from "./ensemble.model";
import { map, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesStorageService {
    constructor(private http: HttpClient, private ensemblesService: EnsemblesSerivce) {}

    storeEnsemble(ensemble: Ensemble) {
        this.http.post('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles.json', 
        ensemble).subscribe();
    }

    fetchEnsembles() {
        return this.http.get('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles.json')
        .pipe(tap(ensembles => {
            let ensemblesArray = []
            for (var key in ensembles) {
                if (ensembles.hasOwnProperty(key)) {
                    ensemblesArray.push(ensembles[key]);
                }
            }
            this.ensemblesService.setEnsembles(ensemblesArray);
        })
    )}

}