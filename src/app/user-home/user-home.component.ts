import { Ensemble } from './../ensembles/ensemble.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { Profile } from '../profile-creation/profile.model';
import { ProfileService } from '../profile-creation/profile.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EnsemblesService } from '../ensembles/ensembles.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  user: User = null;
  profile: Profile;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private ensembleService: EnsemblesService
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        console.log(profile)
        this.profile = profile;
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
