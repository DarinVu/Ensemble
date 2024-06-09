import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  show = false;


  constructor(private router: Router, private authService: AuthService) {}

 
  onShow() {
    this.show = !this.show;
  }

  onSignup() {
    this.router.navigate(['auth', 1]);
  }

  onLogin() {
    this.router.navigate(['auth', 0]);
  }
}
