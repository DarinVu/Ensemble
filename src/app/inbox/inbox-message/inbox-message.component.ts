import { ProfileStorageService } from '../../profile/profile-storage.service';
import { Request } from './../request.model';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { Profile } from '../../profile/profile.model';
import { EnsemblesStorageService } from '../../ensembles/ensembles-storage.service';
import { EnsemblesService } from '../../ensembles/ensembles.service';
import { Ensemble } from '../../ensembles/ensemble.model';
import { Member } from '../../ensembles/member.model';
import { EnsembleShort } from '../../ensembles/ensembleShort.model';
import { isFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-inbox-message',
  templateUrl: './inbox-message.component.html',
  styleUrl: './inbox-message.component.css'
})
export class InboxMessageComponent implements OnInit{
  currentProfile: Profile;
  currentProfileId: string;
  request: Request;
  requestProfileId: string;
  requestEmail: string;
  ensemble: Ensemble;
  requestNum: number;
  acceptMode = false;
  display = '';
  profiles: Profile[];
  spotsTakenError: number;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private ensemblesStorageService: EnsemblesStorageService,
    private ensemblesService: EnsemblesService,
    private profileStorageService: ProfileStorageService

  ) {}

  ngOnInit(): void {
    this.profileService.profilesChanged.subscribe(
      profiles => {
        this.profiles = profiles;
      }
    )

    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
      }
    )

    this.profileService.currentProfileId.subscribe(
      id => {
        this.currentProfileId = id;
      }
    )

    this.route.params.subscribe(
      (params: Params) => {
        this.requestNum = +params['request-num']
        this.request = this.currentProfile.requestsReceived[this.requestNum];
      }
    )

    let profiles = this.profileService.getProfiles();
    
    this.ensemblesService.ensemblesChanged.subscribe(
      ensembles => {
        for (let ensemble of ensembles) {
          var key = Object.keys(ensemble)[0];
          if (key == this.request.ensembleId) {
            this.ensemble = ensemble[key];
          }
        }
      }
    ) 

    

    for (let profile of profiles) {
      var key = Object.keys(profile)[0]
      if (key == this.request.profileId) {
        this.requestProfileId = key;
        this.requestEmail = profile[key]['email'];
      }
    }

    //Check if ensemble needs instrument from requesting user
    for (let i = 0; i < this.ensemble.instrumentsNeeded.length; i++) {
      if (this.request['instrument'] == this.ensemble.instrumentsNeeded[i]['instrument']) {
        this.spotsTakenError = null;
        break;
      }
      if (this.request['instrument'] != this.ensemble.instrumentsNeeded[i]['instrument'] && i == this.ensemble.instrumentsNeeded.length - 1) {
        this.spotsTakenError = this.requestNum;
      }
    }
  }

  onViewProfile() {
    this.router.navigate(['/user', this.request.profileId]);
  }

  onDecline() {
    //Remove request received from host
    let modifiedRequestsReceived = [];
    for (let i = 0; i < this.currentProfile.requestsReceived.length; i++) {
      if (i != this.requestNum) {
        modifiedRequestsReceived.push(this.currentProfile.requestsReceived[i]);
      }
    }
    this.profileStorageService.updateRequestReceivedToProfile(this.currentProfileId, modifiedRequestsReceived).pipe(
      finalize(() => {
        this.currentProfile.requestsReceived = modifiedRequestsReceived;
        this.router.navigate(['..'], {relativeTo: this.route});
      })
    ).subscribe()

    //Remove request sent from requesting user
    let modifiedRequestsSent = [];
    for (let request of this.request.requestsSent) {
      if (request != this.request.ensembleId) {
        modifiedRequestsSent.push(request);
      }
    }
    this.profileStorageService.updateRequestsSentToProfile(this.request.profileId, modifiedRequestsSent).subscribe();
  }

  onAccept() {
    this.display = 'block';
    this.acceptMode = true;

    //Add accepted user to ensemble's list of members
    var requestedUserEnsembles = [];
    var requestedUserProfilePic: string;
    for (let profile of this.profiles) {
      const key = Object.keys(profile)[0];
      if (key == this.request.profileId) {
        requestedUserEnsembles = Object.values(profile)[0]['ensembles'];
        requestedUserProfilePic = Object.values(profile)[0]['profilePic']
      }
    }
    this.ensemble.members.push(new Member(this.requestProfileId, this.request.firstName, requestedUserProfilePic));
    this.ensemblesStorageService.updateEnsembleMembers(this.ensemble.members, this.request.ensembleId).subscribe();
    let modifiedRequests = [];
    for (let i = 0; i < this.currentProfile.requestsReceived.length; i++) {
      if (i != this.requestNum) {
        modifiedRequests.push(this.currentProfile.requestsReceived[i]);
      }
    }

    //Add ensemble to accepted user's ensemble list
    var requestedUserEnsembles = [];
    var requestedUserProfilePic: string;
    for (let profile of this.profiles) {
      const key = Object.keys(profile)[0];
      if (key == this.request.profileId) {
        requestedUserEnsembles = Object.values(profile)[0]['ensembles'];
        requestedUserProfilePic = Object.values(profile)[0]['profilePic']
      }
    }
    requestedUserEnsembles.push(new EnsembleShort(this.request.ensembleId, this.request.ensembleName));
    this.profileStorageService.updateRequestReceivedToProfile(this.currentProfileId, modifiedRequests).pipe(
      finalize(() => {
        this.profileStorageService.updateProfileEnsembles(requestedUserEnsembles, this.request.profileId).subscribe()
        this.currentProfile.requestsReceived = modifiedRequests;
      })
    )
    .subscribe();

    //Add new user's instrument to ensemble's list of instrumentsHave
    var newInstrumentObj = {};
    newInstrumentObj['instrument'] = this.request.instrument
    this.ensemble.instrumentsHave.push(newInstrumentObj);
    this.ensemblesStorageService.updateInstrumentsHave(this.ensemble.instrumentsHave, this.request.ensembleId).subscribe();
    
    //Remove new user's instrument from ensemble's list of instruments needed
    var newInstrumentEntered = false;
    var modifiedInstrumentsNeeded: Object[] = [];
    for (let instrument of this.ensemble.instrumentsNeeded) {
      if (instrument['instrument'] == this.request.instrument && newInstrumentEntered == false) {
        newInstrumentEntered = true;
        continue;
      }
      if (instrument['instrument'] != this.request.instrument || newInstrumentEntered == true) {
        modifiedInstrumentsNeeded.push(instrument);
      }
    }
    this.ensemble.instrumentsNeeded = modifiedInstrumentsNeeded;
    this.ensemblesStorageService.updateInstrumentsNeeded(modifiedInstrumentsNeeded, this.request.ensembleId).subscribe();

     //Remove request sent from requesting user
     let modifiedRequestsSent = [];
     for (let request of this.request.requestsSent) {
       if (request != this.request.ensembleId) {
         modifiedRequestsSent.push(request);
       }
     }
     this.profileStorageService.updateRequestsSentToProfile(this.request.profileId, modifiedRequestsSent).subscribe();
  }

  closeModal() {
    this.display = '';
    this.router.navigate(['..'], {relativeTo: this.route});
  }
} 

