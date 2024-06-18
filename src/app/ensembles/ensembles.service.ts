import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Ensemble } from "./ensemble.model";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesService {
    currentEnsembleId = new BehaviorSubject<string>(null);
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

    public setCurrentEnsembleId(ensembleId: string) {
        this.currentEnsembleId.next(ensembleId);
    }
 
}