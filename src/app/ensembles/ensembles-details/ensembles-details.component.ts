import { Subscription } from 'rxjs';
import { ProfileStorageService } from '../../profile/profile-storage.service';
import { Request } from './../../inbox/request.model';
import { ProfileService } from '../../profile/profile.service';
import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Ensemble } from '../ensemble.model';
import { Profile } from '../../profile/profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Member } from '../member.model';
import { EnsemblesStorageService } from '../ensembles-storage.service';
import { EnsembleShort } from '../ensembleShort.model';
import { finalize } from 'rxjs/operators';

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
  manageMode = false;
  hostMode: boolean;
  confirmKick = false;
  confirmKickId: number;
  confirmLeave = false;
  

  constructor(
    private route: ActivatedRoute, 
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private router: Router,
    private profileStorageService: ProfileStorageService,
    private ensemblesStorageService: EnsemblesStorageService
  ) {}

  ngOnInit(): void {
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

    for (let member of this.ensemble.members) {
      if (member['id'] == this.currentProfileId) {
        this.member = true;
      }
    }

    if(this.host == this.currentProfile) {
      this.hostMode = true;
    } else {
      this.hostMode = false;
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
    let profiles: Profile[] = this.profileService.getProfiles(); 
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      if (key == member['id']) {
        var modifiedEnsembles: EnsembleShort[] = []
        for (let ensemble of Object.values(profile)[0]['ensembles']) {
          if (ensemble['id'] != this.ensembleId) {
            modifiedEnsembles.push(ensemble);
          }
        }
        this.profileStorageService.updateProfileEnsembles(modifiedEnsembles, key).subscribe();
      }
    }
  } 

  onConfirmDisband() {
    //Delete Ensemble from database
    this.ensemblesStorageService.deleteEnsemble(this.ensembleId).pipe(
      finalize(() => {
        this.ensemblesStorageService.fetchEnsembles().subscribe()
      })
    ).subscribe();

    //Remove ensemble from all members' profiles
    let profiles: Profile[] = this.profileService.getProfiles() 
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      let modifiedEnsembles: EnsembleShort[] = [];

      for (let ensemble of Object.values(profile)[0]['ensembles']) {
        if (ensemble['id'] != this.ensembleId) {
          modifiedEnsembles.push(ensemble);
        }
      }
      this.profileStorageService.updateProfileEnsembles(modifiedEnsembles, key).subscribe();
      if (key == this.currentProfileId) {
        this.currentProfile.ensembles = modifiedEnsembles;
      }
    }

    //Route back to the user home page
    this.router.navigate(['/user-home']);
  }

  onConfirmLeave() {
    this.confirmLeave = !this.confirmLeave;
  }

  onLeave() {
    //Get Index of member to match with instrument index
    var memberIndex: number;
    for (let i = 0; i < this.ensemble.members.length; i++) {
      console.log(this.ensemble.members[i]['id'])
      if (this.ensemble.members[i]['id'] == this.currentProfileId) {
        memberIndex = i;
      }
    }

    //Remove member from ensemble's member list
    let modifiedMembers = [];
    for (let member of this.ensemble.members) {
      if (this.currentProfileId != member['id']) {
        modifiedMembers.push(member);
      }
    }
    this.ensemble.members = modifiedMembers;
    this.ensemblesStorageService.updateEnsembleMembers(modifiedMembers, this.ensembleId).subscribe();

    //Remove ensemble from user's ensemble list
    let modifiedEnsembles = [];
    for (let ensemble of this.currentProfile.ensembles) {
      if (ensemble['id'] != this.ensembleId) {
        modifiedEnsembles.push(ensemble);
      }
    }
    this.currentProfile.ensembles = modifiedEnsembles;
    this.profileStorageService.updateProfileEnsembles(modifiedEnsembles, this.currentProfileId).subscribe();
    

    
    //Add member's instrument to instrumentNeeded and remove it from instrumentsHave
    let modifiedInstrumentsHave = []
    for (let i = 0; i < this.ensemble.instrumentsHave.length; i++) {
      if (i != memberIndex) {
        modifiedInstrumentsHave.push(this.ensemble.instrumentsHave[i]);
      } else {
        this.ensemble.instrumentsNeeded.push(this.ensemble.instrumentsHave[i]);
      }
    }
    this.ensemble.instrumentsHave = modifiedInstrumentsHave;
    this.ensemblesStorageService.updateInstrumentsHave(modifiedInstrumentsHave, this.ensembleId).subscribe();
    this.ensemblesStorageService.updateInstrumentsNeeded(this.ensemble.instrumentsNeeded, this.ensembleId).subscribe();

    this.router.navigate(['/user', 'home']);
  }
}
