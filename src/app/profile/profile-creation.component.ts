import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileStorageService } from './profile-storage.service';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { Ensemble } from '../ensembles/ensemble.model';
import { User } from '../auth/user.model';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EnsembleShort } from '../ensembles/ensembleShort.model';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrl: './profile-creation.component.css'
})
export class ProfileCreationComponent implements OnInit {
  @ViewChild('profilePicSample') profilePicSample: ElementRef;
  currentUser: Object;
  profileForm: FormGroup;
  selectedFile: File;
  profilePicLink;
  isLoading: boolean;
  profilePicError = null;
  editMode: boolean;
  currentProfile: Profile;

  constructor(
    private router: Router, 
    private userService: UserService,
    private profileStorageService: ProfileStorageService,
    private profileService: ProfileService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe(
      (params: Params) => {
        if (+params['status'] == 1) {
          this.editMode = true;
          this.profileService.currentProfileChanged.subscribe(
            profile => {
              this.currentProfile = profile;
              
              let instruments = new FormArray([]);
          
              for (let instrument of this.currentProfile.instruments) {
                instruments.push(new FormGroup({
                  'instrument': new FormControl(instrument['instrument'], Validators.required)
                }))
              }

             
              let recordings = new FormArray([]);
              if (this.currentProfile.recordings) {
                for (let recording of this.currentProfile.recordings) {
                  recordings.push(new FormGroup({
                    'recording': new FormControl(recording['recording'])
                  }))
                }
              } else {
                recordings.push(new FormGroup({
                  'recording': new FormControl(null)
                }))
              }
              
          
              this.profileForm = new FormGroup({
                'firstName': new FormControl(this.currentProfile.firstName, Validators.required),
                'lastName': new FormControl(this.currentProfile.lastName, Validators.required),
                'instruments': instruments,
                'bio': new FormControl(this.currentProfile.bio, Validators.maxLength(100)),
                'profilePic': new FormControl(null),
                'recordings': recordings
              })
            }
          )
        } else {
          this.editMode = false;
          this.isLoading = false;
           this.currentUser = this.userService.getUserInProgress();

          let instruments = new FormArray([new FormGroup({
            'instrument': new FormControl(null, Validators.required)
          })]);
      
          let recordings = new FormArray([new FormGroup({
            'recording': new FormControl(null)
          })]);
      
          this.profileForm = new FormGroup({
            'firstName': new FormControl(null, Validators.required),
            'lastName': new FormControl(null, Validators.required),
            'instruments': instruments,
            'bio': new FormControl(null, Validators.maxLength(100)),
            'profilePic': new FormControl(null),
            'recordings': recordings
          })
        }
      }
    )
  }
    
  onAddInstrument() {
    (<FormArray>this.profileForm.get('instruments')).push(
      new FormGroup({
        'instrument': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteInstrument(index: number) {
    (<FormArray>this.profileForm.get('instruments')).removeAt(index);
  }


  get instrumentControls() {
    return (<FormArray>this.profileForm.get('instruments')).controls;
  }

  onAddRecording() {
    (<FormArray>this.profileForm.get('recordings')).push(
      new FormGroup({
        'recording': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteRecording(index: number) {
    (<FormArray>this.profileForm.get('recordings')).removeAt(index);
  }


  get recordingControls() {
    return (<FormArray>this.profileForm.get('recordings')).controls;
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      if (files[0].size <= 1000000) {
        this.profilePicError = false;
        this.selectedFile = files[0]
        const reader = new FileReader();

        reader.readAsDataURL(files[0])

        reader.onload = () => {
          this.profilePicSample.nativeElement.src = reader.result
        }
      } else {
        //If file selected is > than 1mb than write error to screen and reset the form control
        this.profilePicError = true;
        this.profileForm.controls['profilePic'].setValue(null);
      }    
    }
  }

  

  onSubmit() {
    this.isLoading = true;
    const firstName = this.profileForm.value['firstName'].charAt(0).toUpperCase() + this.profileForm.value['firstName'].substring(1);
    const lastName = this.profileForm.value['lastName'].charAt(0).toUpperCase() + this.profileForm.value['lastName'].substring(1);
    if (this.editMode) {
      var currentProfileId: string;
      this.profileService.currentProfileId.subscribe(
        id => {
          currentProfileId = id;
        }
      )
      if (this.selectedFile) {
        const filePath = `profile-pics/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedFile);
        const url = uploadTask.snapshotChanges().pipe(
          finalize(() => {
            //Get image url after file uploads
            fileRef.getDownloadURL().subscribe(
              url => {
                const newProfile = new Profile(
                this.currentProfile.email,
                firstName,
                lastName,
                this.profileForm.value['instruments'],
                [new EnsembleShort('aaa', null)],
                this.profileForm.value['recordings'],
                this.profileForm.value['bio'],
                url
              )
              this.profileStorageService.editProfile(currentProfileId, newProfile);
              this.profileService.setCurrentProfile(newProfile);
              this.router.navigate(['/user', 'home']);
            }
          )
        })
       ).subscribe()
      } else {
        const newProfile = new Profile(
          this.currentProfile.email,
          firstName,
          lastName,
          this.profileForm.value['instruments'],
          [new EnsembleShort('aaa', null)],
          this.profileForm.value['recordings'],
          this.profileForm.value['bio'],
          this.currentProfile.profilePic
        )
        this.profileStorageService.editProfile(currentProfileId, newProfile);
        this.profileService.setCurrentProfile(newProfile);
        this.router.navigate(['/user', 'home']);
        }
    } else {
      if (this.selectedFile) {
        const email = this.userService.getUserInProgress()['email'];
        const filePath = `profile-pics/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedFile);
        const url = uploadTask.snapshotChanges().pipe(
          finalize(() => {
            //Get image url after file uploads
            fileRef.getDownloadURL().subscribe(
              url => {
                //Create a new profile with information from form
                const newProfile = new Profile(
                  email,
                  firstName,
                  lastName,
                  this.profileForm.value['instruments'],
                  [new EnsembleShort('aaa', null)],
                  this.profileForm.value['recordings'],
                  this.profileForm.value['bio'],
                  url
                )
                this.profileStorageService.storeProfile(newProfile);
                this.profileService.addProfile(newProfile);
                this.profileService.setCurrentProfile(newProfile);
                this.router.navigate(['/user', 'home']);
              }
            )
            
          })
        ).subscribe()
      } else {
        const email = this.userService.getUserInProgress()['email'];
        const newProfile = new Profile(
          email,
          firstName,
          lastName,
          this.profileForm.value['instruments'],
          [new EnsembleShort('aaa', null)],
          this.profileForm.value['recordings'],
          this.profileForm.value['bio'],
          'https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg'
        )
        this.profileStorageService.storeProfile(newProfile);
        this.profileService.addProfile(newProfile);
        this.profileService.setCurrentProfile(newProfile);
        this.router.navigate(['/user', 'home']);
             
      }
    }  
  }
}
