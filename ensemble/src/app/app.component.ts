import { Component, OnInit } from '@angular/core';
import { EnsemblesStorageService } from './ensembles/ensembles-storage.service';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile-creation/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ensemble';

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.authService.autoLogin();

  }
}
