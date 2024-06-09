import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  show = false;
  displayDropdown = 'none';

  constructor(private authService: AuthService, private router: Router) {}

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
}
