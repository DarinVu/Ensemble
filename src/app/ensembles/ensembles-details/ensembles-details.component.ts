import { ProfileStorageService } from './../../profile-creation/profile-storage.service';
import { Request } from './../../inbox/request.model';
import { ProfileService } from './../../profile-creation/profile.service';
import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Ensemble } from '../ensemble.model';
import { Profile } from '../../profile-creation/profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Member } from '../member.model';
import { EnsemblesStorageService } from '../ensembles-storage.service';
import { EnsembleShort } from '../ensembleShort.model';

@Component({
  selector: 'app-ensembles-details',
  templateUrl: './ensembles-details.component.html',
  styleUrl: './ensembles-details.component.css'
})
export class EnsemblesDetailsComponent implements OnInit {
  ensemble: Ensemble;
  host: Profile;
  hostId: string;
  currentProfileId: string;
  currentProfile: Profile;
  currentProfileFirstName: string;
  currentProfileLastName: string;
  display = '';
  requestForm: FormGroup;
  ensembleId: string;
  requestSubmitted = false;
  member = false;
  manageMode: boolean;
  hostMode: boolean;
  confirmKick: boolean;
  confirmKickId: number;
  disbandMode = false;
  disbandDisplay = '';
  

  constructor(
    private route: ActivatedRoute, 
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private router: Router,
    private profileStorageService: ProfileStorageService,
    private ensemblesStorageService: EnsemblesStorageService
  ) {}

  ngOnInit(): void {
    console.log(this.disbandMode)
    this.confirmKick = false;
    this.manageMode = false;
    this.route.params.subscribe(
      (params: Params) => {
        var ensembles: Ensemble[] = this.ensemblesService.getEnsembles();
        for (let ensemble of ensembles) {
          var key = Object.keys(ensemble)[0]
          if (key == params['id']) {
            this.ensembleId = key;
            this.ensemble = ensemble[key];
            this.ensemblesService.setCurrentEnsembleId(key);
            break;
          }
        }
      }
    )
    let profiles = this.profileService.getProfiles();
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      if (key == this.ensemble.members[0]['id']) {
        this.hostId = key;
        this.host = profile[key];
      }
    }
    this.profileService.currentProfileId.subscribe(
      profile => {
        this.currentProfileId = profile;
      }
    )

    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
        this.currentProfileFirstName = profile.firstName;
        this.currentProfileLastName = profile.lastName;
      }
    )
    
    if(this.host == this.currentProfile) {
      this.hostMode = true;
    } else {
      this.hostMode = false;
    }

    for (let member of this.ensemble.members) {
      if (member['id'] == this.currentProfileId) {
        this.member = true;
      }
    }

    this.requestForm = new FormGroup({
      'message': new FormControl(null),
      'instrument': new FormControl(null, Validators.required)
    })

    
  }

  onChat() {
    this.router.navigate(['chat'], {relativeTo: this.route });
  }

  openModal() {
    this.display = 'block';
  }

  closeModal() {
    this.display = '';
    this.requestSubmitted = false;
  }

  onRequest() {
    if (this.requestForm.value['message'] == null) {
      var request = new Request(
        this.currentProfileId, 
        this.currentProfileFirstName, 
        this.currentProfileLastName,
        this.ensembleId,
        this.ensemble.name,
        this.currentProfile.profilePic,
        this.requestForm.value['instrument']
      )
    } else {
      var request = new Request(
        this.currentProfileId,
        this.currentProfileFirstName, 
        this.currentProfileLastName,
        this.ensembleId,
        this.ensemble.name,
        this.currentProfile.profilePic,
        this.requestForm.value['instrument'],
        this.requestForm.value['message'])
    }

    this.host.requests.push(request);
    this.profileStorageService.addRequestToProfile(this.hostId, this.host.requests).subscribe(
      resData => {
        this.requestSubmitted = true;
      }
    )
  }

  onViewProfile(member) {
    this.router.navigate(['/user', member.id])
  }

  onManageMembers() {
    if (this.manageMode == true) {
      this.confirmKick = false;
      this.confirmKickId = null;
    }
    this.manageMode = !this.manageMode;
  }

  onKick(i: number) {
    //switch to confirm button when kick is pressed
    this.confirmKickId = i;
    this.confirmKick = true;
  }

  onConfirm(indexOfMember: number, member: Member) {
    //Update the list of members for ensemble
    var modifiedMembers: Member[] = [];
    for (let i = 0; i < this.ensemble.members.length; i++) {
      if (i != indexOfMember) {
        modifiedMembers.push(this.ensemble.members[i]);
      }
    }
    this.ensemblesStorageService.updateEnsembleMembers(modifiedMembers, this.ensembleId).subscribe(
      resData => {
        this.ensemble.members = modifiedMembers;
      }
    );

    //Update the kicked member's ensemble page.
    let profiles: Profile[] = this.profileService.getProfiles() 
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      if (key == member['id']) {
        var modifiedEnsembles: EnsembleShort[] = []
        for (let ensemble of Object.values(profile)[0]['ensembles']) {
          if (ensemble['id'] != this.ensembleId) {
            modifiedEnsembles.push(ensemble);
          }
        }
        this.profileStorageService.addEnsembleToProfile(modifiedEnsembles, key).subscribe();
      }
    }
  } 

  onDisband() {
    this.disbandMode = true;
    this.disbandDisplay = 'block';
  }

  closeDisbandModal() {
    this.disbandDisplay = '';
    this.disbandMode = false;
  }

  onConfirmDisband() {
    this.ensemblesStorageService.deleteEnsemble(this.ensembleId).subscribe(

    )
  }
}
