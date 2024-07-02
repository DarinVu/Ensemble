import { Ensemble } from './../../ensemble.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnsemblesService } from '../../ensembles.service';

@Component({
  selector: 'app-ensembles-item',
  templateUrl: './ensembles-item.component.html',
  styleUrl: './ensembles-item.component.css'
})
export class EnsemblesItemComponent implements OnInit {
  @Input() ensembleId: string;
  @Input() ensemble: Ensemble;
  // ensemble: Ensemble


  ngOnInit(): void {
    // console.log(this.ensemble)
    // this.ensemble = Object.values(this.ensembleObj)[0];
  }

  constructor(private router: Router, private ensemblesService: EnsemblesService) {}

  onGetDetails() {
    this.router.navigate(['/ensembles-details', this.ensembleId]);
  }
}
