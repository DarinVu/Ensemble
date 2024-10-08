import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";
import { EnsemblesService } from './ensembles.service';
import { EnsemblesStorageService } from './ensembles-storage.service';
import { Ensemble } from './ensemble.model';

@Injectable({
    providedIn: 'root'
})
export class EnsemblesResolverService implements Resolve<any> {
    constructor(private ensemblesService: EnsemblesService, private ensemblesStorageService: EnsemblesStorageService) {}


    resolve() {
        if (this.ensemblesService.getEnsembles().length === 0) {
            return this.ensemblesStorageService.fetchEnsembles();
        }
        }
    
}