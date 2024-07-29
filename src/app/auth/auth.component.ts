import { ProfileService } from '../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  signupForm: FormGroup;
  loginStatus: boolean;
  isLoading = false;
  error: string = null;


  constructor(
    private router: Router, 
    private userService: UserService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        if (+params['status'] == 0) {
          this.loginStatus = true;
        } else {
          this.loginStatus = false;
        }
      }
    )

    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  onSubmit() {
    this.isLoading = true;

    const email = this.signupForm.value['email'];
    const password = this.signupForm.value['password'];
    
    const user = {
      'email': email,
      'password': password
    };

    

    if (this.loginStatus) {
      this.authService.login(email, password).subscribe(
        resData => {
          let profiles = this.profileService.getProfiles()
          for (let i = 0; i < profiles.length; i++) {
            if (Object.values(profiles[i])[0]['email'] == email) {
              this.isLoading = false;
              this.error = null;
              this.changeCurrentProfile();
              this.router.navigate(['/user', 'home']);
              break;
            }
            if (Object.values(profiles[i])[0]['email'] != email && i == profiles.length - 1) {
              this.userService.setUserInProgress({
                email: resData.email, 
                id: resData.localId, 
                idToken: resData.idToken, 
                duration: +resData.expiresIn
              })
              this.router.navigate(['/profile-creation', 0]);
            }
          }
        }, 
        errorMessage => {
          this.error = errorMessage
          this.isLoading = false;
        }
      );
    } else {
      this.authService.signup(email, password).subscribe(
        resData => {
          this.isLoading = false;
          this.error = null;
          this.changeCurrentProfile();
          this.router.navigate(['/profile-creation', 0]);
        }, 
        errorMessage => {
          this.error = errorMessage
          this.isLoading = false;
        }
      );
    }
  }

  changeCurrentProfile() {
    this.authService.user.subscribe(
      user => {
        var profiles = this.profileService.getProfiles();
        if (profiles.length == 1) {
          this.profileService.setCurrentProfile(profiles[0]);
        }
        for (let profile of profiles) {
          var key = Object.keys(profile)[0];
          if (profile[key]['email'] == user.email) {
            this.profileService.setCurrentProfile(profile[key]);
          }
      }
      }
    )
  }

  onSignUp() {
    this.router.navigate(['/auth', 1]);
    this.error = null;
    this.signupForm.reset();
  }

  onLogin() {
    this.router.navigate(['/auth', 0]);
    this.error = null;
    this.signupForm.reset();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
    this.changeCurrentProfile
  }
}
