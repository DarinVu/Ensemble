import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Request } from './request.model';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit{
  isLoading = true;
  profile: Profile;

  constructor(
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.profile = profile;
        this.isLoading = false;
      }
    )
  }
}
