import { ProfileService } from '../../profile/profile.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../../profile/profile.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  profile: Profile;
  show = false;
  displayDropdown = 'none';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.profile = profile;
      }
    )
  }

  onShow() {
    this.show = !this.show;
    
  }

  onDisplayDropdown() {
    if (this.displayDropdown == 'none') {
      this.displayDropdown = 'block';
    } else {
      this.displayDropdown = 'none';
    }
  }

  onCloseDropdown() {
    this.displayDropdown = 'none'
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  onEditProfile() {
    this.router.navigate(['/profile-creation', 1]);
  }

  goHome() {
    this.router.navigate(['/user', 'home']);
  }

  checkInbox() {
    this.router.navigate(['/inbox']);
  }
}
