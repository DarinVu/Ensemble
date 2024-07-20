import { Ensemble } from './../../ensemble.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnsemblesService } from '../../ensembles.service';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-ensembles-item',
  templateUrl: './ensembles-item.component.html',
  styleUrl: './ensembles-item.component.css'
})
export class EnsemblesItemComponent implements OnInit {
  @Input() ensembleObj: Object;
  sizeFilter: number;
  instrumentFilter: string;
  genreFilter: string;
  hugeEnsembleFilter: boolean;
  ensemble: Ensemble;
  isEnsembleFull: boolean;
  matchFilters = true;
  sizeMatch: boolean;
  genreMatch: boolean;
  instrumentMatch: boolean;
  hugeEnsembleMatch: boolean;

  constructor(
    private router: Router, 
    private filtersService: FiltersService
  ) {}


  ngOnInit(): void {
    this.ensemble = Object.values(this.ensembleObj)[0];
    this.filtersService.sizeFilter.subscribe(
      size => {
        this.sizeFilter = size;
      }
    )
    this.filtersService.instrumentFilter.subscribe(
      instrument => {
        this.instrumentFilter = instrument;
      }
    )
    this.filtersService.genreFilter.subscribe(
      genre => {
        this.genreFilter = genre;
      }
    )
    this.filtersService.hugeEnsembleFilter.subscribe(
      status => {
        this.hugeEnsembleFilter = status;
      }
    )
    //When notified of filter change, adjust ensemble list accordingly
    this.filtersService.filtersChange.subscribe(
      change => {
        if (this.sizeFilter == this.ensemble.size || !this.sizeFilter) {
          this.sizeMatch = true;
        } else {
          this.sizeMatch = false;
        }

        if (this.instrumentFilter) {
          for (let i = 0; i < this.ensemble.instrumentsNeeded.length - 1; i++) {
            if (this.instrumentFilter == this.ensemble.instrumentsNeeded[i]['instrument']) {
              this.instrumentMatch = true;
            }
            if (this.instrumentFilter != this.ensemble.instrumentsNeeded[i]['instrument'] && i == this.ensemble.instrumentsNeeded.length - 1) {
              this.instrumentMatch = false;
            }
          }
        } 
        if (!this.instrumentFilter) {
          this.instrumentMatch = true;
        }
        
        if (this.genreFilter == this.ensemble.genre || !this.genreFilter) {
          this.genreMatch = true;
        } else {
          this.genreMatch = false;
        }

        if ((this.hugeEnsembleFilter && this.ensemble.size >= 10) || !this.hugeEnsembleFilter) {
          this.hugeEnsembleMatch = true;
        } else {
          this.hugeEnsembleMatch = false;
        }

        if (this.sizeMatch && this.instrumentMatch && this.genreMatch && this.hugeEnsembleMatch) {
          this.matchFilters = true;
        } else {
          this.matchFilters = false;
        }
      }
    )
  }


  onGetDetails() {
      const key = Object.keys(this.ensembleObj)[0]
      this.router.navigate(['/ensembles', 'details', key]);
  }
}
