import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { Profile } from '../profile-creation/profile.model';
import { ProfileService } from '../profile-creation/profile.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  user: User = null;
  profile: Profile;

  constructor(
    private profileService: ProfileService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe(
      user => {
        var profiles = this.profileService.getProfiles();
        if (profiles.length == 1) {
          this.profile = profiles[0];
        }
        for (let profile of profiles) {
          var key = Object.keys(profile)[0];
          if (profile[key]['email'] == user.email) {
            this.profile = profile[key];
            this.profileService.setCurrentProfile(profile[key]);
          }
      }
      }
    )
  }
}
