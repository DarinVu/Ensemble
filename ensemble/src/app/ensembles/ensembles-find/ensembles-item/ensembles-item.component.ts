import { Component, Input } from '@angular/core';
import { Ensemble } from '../../ensemble.model';

@Component({
  selector: 'app-ensembles-item',
  templateUrl: './ensembles-item.component.html',
  styleUrl: './ensembles-item.component.css'
})
export class EnsemblesItemComponent {
  @Input() ensemble: Ensemble;
}
