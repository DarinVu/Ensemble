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
  @Input() ensembleObj: Object;
  ensemble: Ensemble


  ngOnInit(): void {
    this.ensemble = Object.values(this.ensembleObj)[0];
  }

  constructor(private router: Router, private ensemblesService: EnsemblesService) {}

  onGetDetails() {
    const key = Object.keys(this.ensembleObj);
    this.router.navigate(['/ensembles-details', key[0]]);
  }
}
