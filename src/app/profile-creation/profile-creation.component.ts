import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileStorageService } from './profile-storage.service';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { Ensemble } from '../ensembles/ensemble.model';
import { User } from '../auth/user.model';
import { Message } from '../ensembles/ensembles-chat/message.model';
import { EnsembleShort } from '../ensembles/ensembleShort.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrl: './profile-creation.component.css'
})
export class ProfileCreationComponent implements OnInit {
  currentUser: Object;
  profileForm: FormGroup;
  selectedFile: File;
  profilePicLink;
  isLoading: boolean;
  profilePicError = null;
  
  
  constructor(
    private router: Router, 
    private userService: UserService,
    private profileStorageService: ProfileStorageService,
    private profileService: ProfileService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.currentUser = this.userService.getUserInProgress();
    
  
    
    let instruments = new FormArray([new FormGroup({
      'instrument': new FormControl(null, Validators.required)
    })]);

    let videos = new FormArray([new FormGroup({
      'video': new FormControl(null)
    })]);

    let recordings = new FormArray([new FormGroup({
      'recording': new FormControl(null)
    })]);

    this.profileForm = new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'instruments': instruments,
      'bio': new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      'profilePic': new FormControl(null),
      'videos': videos,
      'recordings': recordings
    })
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

  onAddVideo() {
    (<FormArray>this.profileForm.get('videos')).push(
      new FormGroup({
        'video': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteVideo(index: number) {
    (<FormArray>this.profileForm.get('videos')).removeAt(index);
  }


  get videoControls() {
    return (<FormArray>this.profileForm.get('videos')).controls;
  }

  onAddRecording() {
    (<FormArray>this.profileForm.get('recordings')).push(
      new FormGroup({
        'video': new FormControl(null, Validators.required)
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
      } else {
        //If file selected is > than 1mb than write error to screen and reset the form control
        this.profilePicError = true;
        this.profileForm.controls['profilePic'].setValue(null);
      }    
    }
  }

  

  onSubmit() {
    this.isLoading = true;
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
              this.profileForm.value['firstName'],
              this.profileForm.value['lastName'],
              this.profileForm.value['instruments'],
              [new EnsembleShort('aaa', null)],
              this.profileForm.value['videos'],
              this.profileForm.value['recordings'],
              this.profileForm.value['bio'],
              url
            )
        
        
        
            this.profileStorageService.storeProfile(newProfile);
            this.profileService.addProfile(newProfile);
            
            this.router.navigate(['user-home']);
          }
        )
        
      })
    ).subscribe()

    
  }

}
