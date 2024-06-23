import { Request } from './../request.model';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile-creation/profile.service';
import { Profile } from '../../profile-creation/profile.model';

@Component({
  selector: 'app-inbox-message',
  templateUrl: './inbox-message.component.html',
  styleUrl: './inbox-message.component.css'
})
export class InboxMessageComponent implements OnInit{
  currentProfile: Profile;
  request: Request

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
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
  }

  onViewProfile() {
    this.router.navigate(['/user', this.request.profileId]);
  }
} 

