import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnsemblesService } from "./ensembles.service";
import { Ensemble } from "./ensemble.model";
import { map, tap } from "rxjs/operators";
import { Profile } from "../profile/profile.model";
import { Member } from "./member.model";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesStorageService {
    constructor(private http: HttpClient, private ensemblesService: EnsemblesService) {}

    storeEnsemble(ensemble: Ensemble) {
        return this.http.post('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles.json', 
        ensemble);
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

    updateEnsembleMembers(members: Member[], ensembleId: string) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json', 
            {
                'members': members
            }
        )
    }

    updateInstrumentsNeeded(instrumentsNeeded: Object[], ensembleId: string) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json', 
            {
                'instrumentsNeeded': instrumentsNeeded
            }
        )
    }

    updateInstrumentsHave(instrumentsHave: Object[], ensembleId: string) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json', 
            {
                'instrumentsHave': instrumentsHave
            }
        )
    }

    deleteEnsemble(ensembleId: string) {
        return this.http.delete('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json');
    }

}