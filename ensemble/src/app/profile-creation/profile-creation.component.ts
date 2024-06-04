import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrl: './profile-creation.component.css'
})
export class ProfileCreationComponent implements OnInit {
  currentUser: any;
  profileForm: FormGroup;
  
  
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUserInProgress();
    
    let instruments = new FormArray([new FormGroup({
      'instrument': new FormControl(null, Validators.required)
    })]);

    let videos = new FormArray([new FormGroup({
      'video': new FormControl(null, Validators.required)
    })]);

    let recordings = new FormArray([new FormGroup({
      'recording': new FormControl(null, Validators.required)
    })]);

    this.profileForm = new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'instruments': instruments,
      'bio': new FormControl(null, [Validators.required, Validators.maxLength(100)]),
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

  onSubmit() {
    this.router.navigate(['user-home']);
  }

}
