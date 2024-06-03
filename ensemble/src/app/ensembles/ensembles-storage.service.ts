import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnsemblesService } from "./ensembles.service";
import { Ensemble } from "./ensemble.model";
import { map, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesStorageService {
    constructor(private http: HttpClient, private ensemblesService: EnsemblesService) {}

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
                    var ensembleId = key;
                    var ensembleObj = {};
                    ensembleObj[ensembleId] = ensembles[key];
                    ensemblesArray.push(ensembleObj);
                }
            }
            this.ensemblesService.setEnsembles(ensemblesArray);
        })
    )}

}