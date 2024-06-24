import { ProfileStorageService } from './../../profile-creation/profile-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ensemble } from '../ensemble.model';
import { EnsemblesStorageService } from '../ensembles-storage.service';
import { EnsemblesService } from '../ensembles.service';
import { Profile } from '../../profile-creation/profile.model';
import { ProfileService } from '../../profile-creation/profile.service';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Member } from '../member.model';

@Component({
  selector: 'app-ensembles-create',
  templateUrl: './ensembles-create.component.html',
  styleUrl: './ensembles-create.component.css',
  providers: [DatePipe]
})
export class EnsemblesCreateComponent implements OnInit{
  ensembleSize: number;
  ensembleForm: FormGroup;
  currentProfile: Profile = null;
  currentProfileId: string;
  
  constructor(
    private ensemblesStorageService: EnsemblesStorageService,
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService,
    private profileStorageService: ProfileStorageService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    let instruments = new FormArray([]);
    this.ensembleForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'date': new FormControl(null, Validators.required),
      'time': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'size': new FormControl(null, Validators.required),
      'instruments': instruments,
      'genre': new FormControl("Select a Genre", Validators.required),
      'status': new FormControl(null, Validators.required)
    })

    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
        console.log(profile)
      }
    );
    
    this.profileService.currentProfileId.subscribe(
      id => {
        this.currentProfileId = id;
        console.log(id)
      }
    );
  }

  onChangeSize() {
    (<FormArray>this.ensembleForm.get('instruments')).clear();
    console.log(this.ensembleForm.value.size)
    console.log(this.ensembleForm.value['size']);
    this.ensembleSize = this.ensembleForm.value['size'];
    for (let i = 0; i < this.ensembleSize; i++) {
      (<FormArray>this.ensembleForm.get('instruments')).push(
        new FormGroup({
          'instrument': new FormControl(null, Validators.required)
        })
      )
    }
  }

  get controls() {
    return (<FormArray>this.ensembleForm.get('instruments')).controls;
  }

  onSubmit() {
    const formattedDate = this.datePipe.transform(this.ensembleForm.value['date'], 'mediumDate');
    const formattedTime = this.datePipe.transform(this.ensembleForm.value['date'] + ' ' + this.ensembleForm.value['time'] + ':00', 'shortTime')

    const newEnsemble = new Ensemble(
      this.ensembleForm.value['name'],
      formattedDate,
      formattedTime,
      this.ensembleForm.value['description'],
      this.ensembleForm.value['size'],
      this.ensembleForm.value['instruments'],
      this.ensembleForm.value['genre'],
      this.ensembleForm.value['status'],
      [new Member(this.currentProfileId, this.currentProfile.firstName)]
    )

    console.log(newEnsemble)

    this.ensemblesStorageService.storeEnsemble(newEnsemble).subscribe(
      resDate => {
        this.ensemblesService.addEnsemble(newEnsemble);
        this.currentProfile.ensembles.push(newEnsemble);
        this.profileStorageService.addEnsembleToProfile(this.currentProfile.ensembles).subscribe(
          resData => {
            this.router.navigate(['/ensembles-find']);
          }
        )
      }
    );
    
  }
}
