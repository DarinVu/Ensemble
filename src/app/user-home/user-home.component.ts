import { Ensemble } from './../ensembles/ensemble.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { Profile } from '../profile-creation/profile.model';
import { ProfileService } from '../profile-creation/profile.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EnsemblesService } from '../ensembles/ensembles.service';
import { EnsembleShort } from '../ensembles/ensembleShort.model';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  user: User = null;
  isLoading = true;
  profile: Profile;
  ensembles: EnsembleShort[]

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private ensembleService: EnsemblesService
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.profile = profile;
        this.ensembles = this.profile.ensembles.slice(1);
        
        this.isLoading = false;
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
