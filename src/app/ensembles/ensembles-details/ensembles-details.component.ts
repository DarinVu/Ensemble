import { ProfileService } from './../../profile-creation/profile.service';
import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Ensemble } from '../ensemble.model';

@Component({
  selector: 'app-ensembles-details',
  templateUrl: './ensembles-details.component.html',
  styleUrl: './ensembles-details.component.css'
})
export class EnsemblesDetailsComponent implements OnInit {
  ensemble: Ensemble;
  host: string;

  constructor(
    private route: ActivatedRoute, 
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        var ensembles: Ensemble[] = this.ensemblesService.getEnsembles();
        for (let ensemble of ensembles) {
          var key = Object.keys(ensemble)[0]
          if (key == params['id']) {
            this.ensemble = ensemble[key];
            // this.ensemblesService.setCurrentEnsemble(ensemble[key]);
          }
        }
      }
    )
    let profiles = this.profileService.getProfiles();
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      if (profile[key]['email'] == this.ensemble.members[0]) {
        this.host = profile[key]['firstName'] + ' ' + profile[key]['lastName'];
      }
    }
  }

  onChat() {
    this.router.navigate(['chat'], {relativeTo: this.route });
  }



}
