import { EnsemblesService } from './ensembles/ensembles.service';
import { Component, OnInit } from '@angular/core';
import { EnsemblesStorageService } from './ensembles/ensembles-storage.service';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile-creation/profile.service';
import { ProfileStorageService } from './profile-creation/profile-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ensemble';

  constructor(
    private authService: AuthService,
    private ensemblesService: EnsemblesService,
    private ensemblesStorageService: EnsemblesStorageService,
    private profileService: ProfileService,
    private profileStorageService: ProfileStorageService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
