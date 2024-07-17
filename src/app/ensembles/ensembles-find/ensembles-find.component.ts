import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnsemblesService } from '../ensembles.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FiltersService } from './filters.service';

@Component({
  selector: 'app-ensembles-find',
  templateUrl: './ensembles-find.component.html',
  styleUrl: './ensembles-find.component.css'
})
export class EnsemblesFindComponent implements OnInit, OnDestroy {
  displayDropdown1 = 'none';
  displayDropdown2 = 'none';
  displayDropdown3 = 'none';
  ensembles = [];
  ensembleValues = [];
  ensembleIds = []
  subscription: Subscription;
  sizeFilter: number;
  genreFilter: string;
  instrumentFilter: string;
  hugeEnsembleFilter: boolean

  constructor(private ensemblesService: EnsemblesService, private filtersService: FiltersService) {}

  ngOnInit(): void {
  this.subscription = this.ensemblesService.ensemblesChanged.subscribe(
      ensembles => {
        this.ensembles = ensembles;
      }
    )
  }

  onDisplayDropdown1() {
    if (this.displayDropdown1 == 'none') {
      this.displayDropdown1 = 'block';
    } else {
      this.displayDropdown1 = 'none';
    }
  }

  onCloseDropdown1() {
    this.displayDropdown1 = 'none'
  }
  
  onDisplayDropdown2() {
    if (this.displayDropdown2 == 'none') {
      this.displayDropdown2 = 'block';
    } else {
      this.displayDropdown2 = 'none';
    }
  }

  onCloseDropdown2() {
    this.displayDropdown2 = 'none'
  }

  onDisplayDropdown3() {
    if (this.displayDropdown3 == 'none') {
      this.displayDropdown3 = 'block';
    } else {
      this.displayDropdown3 = 'none';
    }
  }

  onCloseDropdown3() {
    this.displayDropdown3 = 'none'
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSetSizeFilter(size: number) {
    this.sizeFilter = size;
    this.filtersService.setSizeFilter(size);
    this.filtersService.setHugeEnsembleFilter(false);
    this.filtersService.notifyFiltersChange();
  }

  onSetGenreFilter(genre: string) {
    this.genreFilter = genre;
    this.filtersService.setGenreFilter(genre);
    this.filtersService.notifyFiltersChange();
  }

  onSetInstrumentFilter(instrument: string) {
    this.instrumentFilter = instrument;
    this.filtersService.setInstrumentFilter(instrument);
    this.filtersService.notifyFiltersChange();
  }

  onHugeEnsembleFilter() {
    this.sizeFilter = null
    this.hugeEnsembleFilter = true;
    this.filtersService.setHugeEnsembleFilter(true);
    this.filtersService.setSizeFilter(null);
    this.filtersService.notifyFiltersChange();
  }

  onClearFilters() {
    this.sizeFilter = null;
    this.genreFilter = null;
    this.instrumentFilter = null;
    this.hugeEnsembleFilter = null;
    this.filtersService.setSizeFilter(null);
    this.filtersService.setGenreFilter(null);
    this.filtersService.setInstrumentFilter(null);
    this.filtersService.setHugeEnsembleFilter(null);
    this.filtersService.notifyFiltersChange();
  }
}
