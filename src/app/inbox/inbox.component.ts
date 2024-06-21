import { Profile } from '../profile-creation/profile.model';
import { ProfileService } from './../profile-creation/profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit{
  profile: Profile;

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.profile = profile;
      }
    )
  }
}
