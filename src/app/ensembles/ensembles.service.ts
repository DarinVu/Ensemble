import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ensemble } from "./ensemble.model";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesService {
    currentEnsemble = new Subject<Ensemble>();
    ensemblesChanged = new Subject<Ensemble[]>();

    private ensembles = [];

    public getEnsembles() {
        return this.ensembles.slice();  
    }

    public addEnsemble(newEnsemble: Ensemble) {
        this.ensembles.push(newEnsemble);
        this.ensemblesChanged.next(this.ensembles.slice());
    }

    public setEnsembles(ensembles: Ensemble[]) {
        this.ensembles = ensembles;
        this.ensemblesChanged.next(this.ensembles.slice());
    }

    public setCurrentEnsemble(ensemble: Ensemble) {
        this.currentEnsemble.next(ensemble);
        console.log(ensemble)
    }
 
}