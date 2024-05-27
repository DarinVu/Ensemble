import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ensemble } from "./ensemble.model";

@Injectable({
    providedIn: 'root'
})
export class EnsemblesSerivce {
    ensemblesChanged = new Subject<Ensemble[]>();

    private ensembles = [];

    public getEnsembles() {
        console.log('hello')
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


}