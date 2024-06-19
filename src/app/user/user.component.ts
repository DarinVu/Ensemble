import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile-creation/profile.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EnsemblesService } from '../ensembles/ensembles.service';
import { Profile } from '../profile-creation/profile.model';
import { User } from '../auth/user.model';
import { Ensemble } from '../ensembles/ensemble.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  user: User = null;
  profile: Profile;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private ensembleService: EnsemblesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        let profiles = this.profileService.getProfiles();
        for (let profile of profiles) {
          
          let key = Object.keys(profile)[0];
          if (key == params['id']) {
            this.profile = profile[key];
            console.log(profile)
          }
        }
      }
    )
  }

  onViewEnsemble(selectedEnsemble: Ensemble) {
    let ensembles = this.ensembleService.getEnsembles();
    for (let ensemble of ensembles) {
      let key = Object.keys(ensemble)[0];
      if (ensemble[key]['name'] == selectedEnsemble['name']) {
        this.router.navigate(['/ensembles-details', key]);
      }
    }
  }
}


