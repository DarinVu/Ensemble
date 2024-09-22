import { ProfileStorageService } from '../profile/profile-storage.service';
import { Ensemble } from '../ensembles/ensemble.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EnsemblesService } from '../ensembles/ensembles.service';
import { EnsembleShort } from '../ensembles/ensembleShort.model';
import { EnsemblesStorageService } from '../ensembles/ensembles-storage.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  user: User = null;
  profile: Profile;
  profileId: string;
  profileEnsembles: EnsembleShort[];
  sliderCounter: number;
  homeMode: boolean;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private ensembleService: EnsemblesService,
    private route: ActivatedRoute,
    private ensemblesStorageService: EnsemblesStorageService,
    private profileStorageService: ProfileStorageService
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
              this.profileId = key;
              this.profileEnsembles = this.profile.ensembles.slice(1);
            } 
          }
        } else {
          this.homeMode = true;
          this.profileService.currentProfileChanged.subscribe(
            profile => {
              this.profile = profile;
              this.profileEnsembles = this.profile.ensembles.slice(1);
  
            }
          )
        }
      }
    )
    
    //Automatically delete ensemble from database (ensemble list and user profiles) if it's date is past today's date
    for (let ensemble of this.ensembleService.getEnsembles()) {
      const today = new Date();
      if (new Date(Object.values(ensemble)[0]['date']) < today) {
        var ensembleId = Object.keys(ensemble)[0]
        this.ensemblesStorageService.deleteEnsemble(ensembleId).pipe(
          finalize(() => {
            this.ensemblesStorageService.fetchEnsembles().subscribe()
          })
        ).subscribe();
        let profiles: Profile[] = this.profileService.getProfiles() 
        for (let profile of profiles) {
          var key = Object.keys(profile)[0];
          let modifiedEnsembles: EnsembleShort[] = [];

          for (let ensemble of Object.values(profile)[0]['ensembles']) {
            if (ensemble['id'] != ensembleId) {
              modifiedEnsembles.push(ensemble);
            } else {
              //Remove request received from host's (current user) data & Remove request sent from current user's data
              let modifiedRequestsReceived = [];
              for (let i = 0; i < this.profile.requestsReceived.length; i++) {
                if (i == 0) {
                  modifiedRequestsReceived.push(this.profile.requestsReceived[i]);
                }
                if (i != 0 && this.profile.requestsReceived[i]['ensembleId'] != ensembleId) {
                  modifiedRequestsReceived.push(this.profile.requestsReceived[i]);  
                }
                if (i != 0 && this.profile.requestsReceived[i]['ensembleId'] == ensembleId) {
                  let modifiedRequestsSent = [];
                  for (let requestSent of this.profile.requestsReceived[i]['requestsSent']) {
                    if (requestSent != ensembleId) {
                      modifiedRequestsSent.push(requestSent);
                    }
                  }
                  this.profileStorageService.updateRequestsSentToProfile(this.profile.requestsReceived[i]['profileId'], modifiedRequestsSent).subscribe();
                }
              }
              this.profile['requestsReceived'] = modifiedRequestsReceived;
              this.profileStorageService.updateRequestReceivedToProfile(this.profileId, modifiedRequestsReceived).subscribe()
            }
          }
          this.profileStorageService.updateProfileEnsembles(modifiedEnsembles, key).subscribe();
          if (key == this.profileId) {
            this.profile.ensembles = modifiedEnsembles;
          }
        }
      }
    }

    
    this.sliderCounter = 0;
    
  }

  onViewEnsemble(selectedEnsemble: Ensemble) {
    let ensembles = this.ensembleService.getEnsembles();
    for (let ensemble of ensembles) {
      let key = Object.keys(ensemble)[0];
      if (ensemble[key]['name'] == selectedEnsemble['name']) {
        this.router.navigate(['/ensembles', 'details', key]);
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
