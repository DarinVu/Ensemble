import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  onSignup() {
    this.router.navigate(['auth', 0]);
  }

  onLogin() {
    this.router.navigate(['auth', 1]);
  }
}
