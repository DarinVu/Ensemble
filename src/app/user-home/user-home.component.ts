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
  ensembles: EnsembleShort[];
  sliderCounter: number;
  homeMode: boolean;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private ensembleService: EnsemblesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        //Checks if the link is the user home link or link to other users
        if (params['id']) {
          this.homeMode = false;
          let profiles = this.profileService.getProfiles();
          for (let profile of profiles) {
            let key = Object.keys(profile)[0];
            if (key == params['id']) {
              this.profile = profile[key];
              this.ensembles = this.profile.ensembles.slice(1);
              this.isLoading = false;
            } 
          }
        } else {
          this.homeMode = true;
          this.profileService.currentProfileChanged.subscribe(
            profile => {
              this.profile = profile;
              this.ensembles = this.profile.ensembles.slice(1);
              this.isLoading = false;
            }
          )
        }
      }
    )
    this.sliderCounter = 0;
    
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

  onPrev() {
    if (this.sliderCounter > 0) {
      this.sliderCounter--;
    }
  }

  onNext() {
    if (this.sliderCounter < this.profile.recordings.length - 1) {
      this.sliderCounter++;
    }
   }

   onEdit() {
    this.router.navigate(['/profile-creation', 1]);
   }
  

}
