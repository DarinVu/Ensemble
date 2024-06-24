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
  request: Request;
  requestProfileId: string;
  requestEmail: string;
  ensemble: Ensemble;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private ensemblesStorageService: EnsemblesStorageService,
    private ensemblesService: EnsemblesService
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
      }
    )

    this.route.params.subscribe(
      (params: Params) => {
        let requestNum = +params['request-num']
        this.request = this.currentProfile.requests[requestNum];
      }
    )

    let profiles = this.profileService.getProfiles();
    let ensembles = this.ensemblesService.getEnsembles();

    for (let profile of profiles) {
      var key = Object.keys(profile)[0]
      if (key == this.request.profileId) {
        this.requestProfileId = key;
        this.requestEmail = profile[key]['email'];
      }
    }

    for (let ensemble of ensembles) {
      var key = Object.keys(ensemble)[0];
      if (key == this.request.ensembleId) {
        this.ensemble = ensemble[key];
      }
    }
  }

  onViewProfile() {
    this.router.navigate(['/user', this.request.profileId]);
  }

  onDecline() {
    
  }

  onAccept() {
    this.ensemble.members.push(new Member(this.requestProfileId, this.request.firstName));
    this.ensemblesStorageService.addMemberToEnsemble(this.ensemble.members, this.request.ensembleId).subscribe();
  }
} 

