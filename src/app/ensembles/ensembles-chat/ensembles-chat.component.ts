import { EnsemblesService } from './../ensembles.service';
import { Component, OnInit } from '@angular/core';
import { Ensemble } from '../ensemble.model';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { ProfileService } from '../../profile-creation/profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatStorageService } from './chat-storage.service';
import { Message } from './message.model';
import { Profile } from '../../profile-creation/profile.model';

@Component({
  selector: 'app-ensembles-chat',
  templateUrl: './ensembles-chat.component.html',
  styleUrl: './ensembles-chat.component.css'
})
export class EnsemblesChatComponent implements OnInit{
  ensemble: Ensemble;
  ensembleId: string;
  host: string;
  messageForm: FormGroup;
  currentProfile: Profile;

  constructor(
    private route: ActivatedRoute, 
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private router: Router,
    private chatStorageService: ChatStorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        var ensembles: Ensemble[] = this.ensemblesService.getEnsembles();
        for (let ensemble of ensembles) {
          var key = Object.keys(ensemble)[0]
          if (key == params['id']) {
            this.ensemble = ensemble[key];
            this.ensembleId = key;
            // this.ensemblesService.setCurrentEnsemble(ensemble[key]);
          }
        }
      }
    )
    let profiles = this.profileService.getProfiles();
    for (let profile of profiles) {
      var key = Object.keys(profile)[0];
      if (profile[key]['email'] == this.ensemble.members[0]) {
        this.host = profile[key]['firstName'] + ' ' + profile[key]['lastName'];
      }
    }

    this.messageForm = new FormGroup({
      'message': new FormControl(null, Validators.required)
    })

    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
      }
    )
  }

  onViewDetails() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  onSubmit(event) {
    if (event.keyCode === 13) {
      console.log(this.ensemble)
      console.log(this.ensemble.chat)
      this.ensemble.chat.push(new Message(this.currentProfile, this.messageForm.value['message']));

      this.chatStorageService.storeMessage(this.ensemble.chat, this.ensembleId).subscribe();
    }
  }
}
