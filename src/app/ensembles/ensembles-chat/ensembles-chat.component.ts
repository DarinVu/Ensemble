import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { Ensemble } from '../ensemble.model';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { ProfileService } from '../../profile-creation/profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ensembles-chat',
  templateUrl: './ensembles-chat.component.html',
  styleUrl: './ensembles-chat.component.css'
})
export class EnsemblesChatComponent implements OnInit{
  ensemble: Ensemble;
  host: string;
  messageForm: FormGroup;

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
            this.ensemblesService.setCurrentEnsemble(ensemble[key]);
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

    this.messageForm = new FormGroup({
      'message': new FormControl(null, Validators.required)
    })
  }

  onViewDetails() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  onSubmit(event) {
    if (event.keyCode === 13) {
      alert('you just pressed the enter key');
      // rest of your code
    }
  }
}
