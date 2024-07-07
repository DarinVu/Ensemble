import { ProfileStorageService } from './../../profile-creation/profile-storage.service';
import { Request } from './../../inbox/request.model';
import { ProfileService } from './../../profile-creation/profile.service';
import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Ensemble } from '../ensemble.model';
import { Profile } from '../../profile-creation/profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute, 
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private router: Router,
    private profileStorageService: ProfileStorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        var ensembles: Ensemble[] = this.ensemblesService.getEnsembles();
        for (let ensemble of ensembles) {
          var key = Object.keys(ensemble)[0]
          if (key == params['id']) {
            this.ensembleId = key;
            console.log(key)
            this.ensemble = ensemble[key];
            this.ensemblesService.setCurrentEnsembleId(key);
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
    console.log(this.host)

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

    console.log(this.member)

    this.requestForm = new FormGroup({
      'message': new FormControl(null)
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
        this.ensemble.name
      )
    } else {
      var request = new Request(
        this.currentProfileId,
        this.currentProfileFirstName, 
        this.currentProfileLastName,
        this.ensembleId,
        this.ensemble.name,
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


}
