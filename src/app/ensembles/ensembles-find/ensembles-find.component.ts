import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnsemblesService } from '../ensembles.service';
import { Subscription } from 'rxjs';

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
  

  constructor(private ensemblesService: EnsemblesService) {}

  ngOnInit(): void {
    

    this.subscription = this.ensemblesService.ensemblesChanged.subscribe(
      ensembles => {
        this.ensembles = ensembles;
      }
    )
    this.ensembles = this.ensemblesService.getEnsembles();
   

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
  
}
