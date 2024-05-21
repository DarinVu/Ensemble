import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrl: './profile-creation.component.css'
})
export class ProfileCreationComponent {
  
  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['user-home']);
  }
}
