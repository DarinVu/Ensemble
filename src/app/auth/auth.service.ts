import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ProfileService } from '../profile/profile.service';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs"
import { Router } from "@angular/router";
import { User } from "./user.model";
import { ProfileStorageService } from '../profile/profile-storage.service';


interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationtimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private profileService: ProfileService,
        private profileStorageService: ProfileStorageService,
        private fireAuth: AngularFireAuth,
        private userService: UserService
    ){}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAuEqeKccr6-WJqBx3hfI5yMHlaGc7qouY',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn
            )
        }));
    }

    loginWithGoogle(status: string) {
        return this.fireAuth.signInWithPopup(new GoogleAuthProvider).then((result) => {
            const email =  result.additionalUserInfo.profile['email'];
            this.userService.setUserInProgress({
                email: email, 
                id: result.additionalUserInfo.profile['id'],
                idToken: result.credential['idToken'],
                duration: 3600
            })
          
            //Set current profile accordingly and also checks if user's email exists in database but has no corresponding profile
            var profiles = this.profileService.getProfiles();
            var noProfile = false;
            for (let i = 0; i < profiles.length; i++) {
                if (profiles.length == 1) {
                    this.profileService.setCurrentProfile(profiles[0]);
                }
                else {
                    var key = Object.keys([profiles[i]])[0];
                    if (Object.values(profiles[i])[0]['email'] == email) {
                        this.profileService.setCurrentProfile(profiles[i][key]);
                        break;
                    }
                    if (Object.values(profiles[i])[0]['email'] != email && i == profiles.length - 1) {
                        noProfile = true;
                    }
                }
                console.log(noProfile)
            }
            if (result.additionalUserInfo.isNewUser == false && noProfile == false) {
                this.handleAuthentication(
                    email,
                    result.additionalUserInfo.profile['id'],
                    result.credential['idToken'],
                    3600
                )    
                this.router.navigate(['/user', 'home']);
            } else if (result.additionalUserInfo.isNewUser == true || noProfile == true) {
                this.router.navigate(['/profile-creation', 0])
            }
        }
    )

    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAuEqeKccr6-WJqBx3hfI5yMHlaGc7qouY',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn
            )
        }));
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

        this.user.subscribe(
            user => {
                this.profileStorageService.fetchProfiles().subscribe(
                    resData => {
                        var profiles = this.profileService.getProfiles();
                        if (profiles.length == 1) {
                          this.profileService.setCurrentProfile(profiles[0]);
                        }
                        for (let profile of profiles) {
                          var key = Object.keys(profile)[0];
                          if (profile[key]['email'] == user.email) {
                            this.profileService.setCurrentProfile(profile[key]);
                            this.profileService.setCurrentProfileId(key);
                        }
                      }
                    }
                );
               
            }
        )
        
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/home']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationtimer) {
            clearTimeout(this.tokenExpirationtimer);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationtimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        )
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        let errorMessage = 'An unknown error occurred!';
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            switch(errorRes.error.error.message){
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already.';
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = 'The information you have entered is incorrect.';
                    break;
            }
            return throwError(errorMessage);
    }
}