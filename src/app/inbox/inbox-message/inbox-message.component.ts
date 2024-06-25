import { ProfileStorageService } from './../../profile-creation/profile-storage.service';
import { Request } from './../request.model';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile-creation/profile.service';
import { Profile } from '../../profile-creation/profile.model';
import { EnsemblesStorageService } from '../../ensembles/ensembles-storage.service';
import { EnsemblesService } from '../../ensembles/ensembles.service';
import { Ensemble } from '../../ensembles/ensemble.model';
import { Member } from '../../ensembles/member.model';

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
  display = ''

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private ensemblesStorageService: EnsemblesStorageService,
    private ensemblesService: EnsemblesService,
    private profileStorageService: ProfileStorageService

  ) {}

  ngOnInit(): void {
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
        this.request = this.currentProfile.requests[this.requestNum];
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

   
  }

  onViewProfile() {
    this.router.navigate(['/user', this.request.profileId]);
  }

  onDecline() {
    
  }

  onAccept() {
    this.display = 'block';
    this.acceptMode = true;
    this.ensemble.members.push(new Member(this.requestProfileId, this.request.firstName));
    this.ensemblesStorageService.addMemberToEnsemble(this.ensemble.members, this.request.ensembleId).subscribe();
    let modifiedRequests = [];
    for (let i = 0; i < this.currentProfile.requests.length; i++) {
      if (i != this.requestNum) {
        modifiedRequests.push(this.currentProfile.requests[i]);
      }
    }
    this.profileStorageService.addRequestToProfile(this.currentProfileId, modifiedRequests).subscribe();
    
  }

  closeModal() {
    this.display = '';
    this.router.navigate(['..'], {relativeTo: this.route});
  }
} 

