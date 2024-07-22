import { ProfileStorageService } from '../../profile/profile-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ensemble } from '../ensemble.model';
import { EnsemblesStorageService } from '../ensembles-storage.service';
import { EnsemblesService } from '../ensembles.service';
import { Profile } from '../../profile/profile.model';
import { ProfileService } from '../../profile/profile.service';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Member } from '../member.model';
import { consumerMarkDirty } from '@angular/core/primitives/signals';
import { EnsembleShort } from '../ensembleShort.model';
import { finalize } from 'rxjs/operators';
import { createDateValidator } from './date-validator';

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
  confirmedSize = false;
  invalidDate: boolean
  
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
      'date': new FormControl(null, [Validators.required, createDateValidator()]),
      'time': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'size': new FormControl(null, [Validators.required, Validators.min(2)]),
      'instruments': instruments,
      'genre': new FormControl("Select a Genre", Validators.required),
      'location': new FormControl(null, Validators.required)
    })

    this.profileService.currentProfileChanged.subscribe(
      profile => {
        this.currentProfile = profile;
      }
    );
    
    this.profileService.currentProfileId.subscribe(
      id => {
        this.currentProfileId = id;
      }
    );
  }

  onChangeSize() {
    (<FormArray>this.ensembleForm.get('instruments')).clear();
    this.ensembleSize = this.ensembleForm.value['size'];
    for (let i = 0; i < this.ensembleSize; i++) {
      (<FormArray>this.ensembleForm.get('instruments')).push(
        new FormGroup({
          'instrument': new FormControl(null, Validators.required)
        })
      )
    }
    this.confirmedSize = true;
  }

  get controls() {
    return (<FormArray>this.ensembleForm.get('instruments')).controls;
  }

  onSubmit() {
    console.log(this.ensembleForm)
    const formattedDate = this.datePipe.transform(this.ensembleForm.value['date'], 'mediumDate');
    const formattedTime = this.datePipe.transform(this.ensembleForm.value['date'] + ' ' + this.ensembleForm.value['time'] + ':00', 'shortTime')
    var ensembleName = '';
    var location = '';

    //Make sure that every word in ensemble name is capitalized
    for (let i = 0; i < this.ensembleForm.value['name'].length; i++) {
      console.log(this.ensembleForm.value['name'].charAt(i))
      if (i == 0) {
        ensembleName = ensembleName.concat(this.ensembleForm.value['name'].charAt(i).toUpperCase());
        continue;
      }
      if (this.ensembleForm.value['name'].charAt(i) == ' ' && this.ensembleForm.value['name'].charAt(i+1)) {
        ensembleName = ensembleName.concat(' ' + this.ensembleForm.value['name'].charAt(i+1).toUpperCase());
        i++;
        continue;
      }
      ensembleName = ensembleName.concat(this.ensembleForm.value['name'].charAt(i));
    }

    //Makes sure that every word in ensemble location is capitalized
    for (let i = 0; i < this.ensembleForm.value['location'].length; i++) {
      if (i == 0) {
        location = location.concat(this.ensembleForm.value['location'].charAt(i).toUpperCase());
        continue;
      }
      if (this.ensembleForm.value['location'].charAt(i) == ' ' && this.ensembleForm.value['location'].charAt(i+1)) {
        location = location.concat(' ' + this.ensembleForm.value['location'].charAt(i+1).toUpperCase());
        i++;
        continue;
      }
      location = location.concat(this.ensembleForm.value['location'].charAt(i));
    }

    const newEnsemble = new Ensemble(
      ensembleName,
      formattedDate,
      formattedTime,
      this.ensembleForm.value['description'],
      this.ensembleForm.value['size'],
      this.ensembleForm.value['instruments'].slice(1),
      [this.ensembleForm.value['instruments'][0]],
      this.ensembleForm.value['genre'],
      location,
      [new Member(this.currentProfileId, this.currentProfile.firstName, this.currentProfile.profilePic)]
    )

    this.ensemblesStorageService.storeEnsemble(newEnsemble).subscribe(
      resData => {
        var modifiedEnsembles = this.ensemblesService.getEnsembles()
        var newEnsembleObj = {};
        newEnsembleObj[resData['name']] = newEnsemble;
        modifiedEnsembles.push(newEnsembleObj);
        this.ensemblesService.setEnsembles(modifiedEnsembles);
        this.router.navigate(['ensembles','find']);

        const newEnsembleShort = new EnsembleShort(
          resData['name'],
          ensembleName
        )
        this.currentProfile.ensembles.push(newEnsembleShort);
        this.profileStorageService.updateProfileEnsembles(this.currentProfile.ensembles, this.currentProfileId).subscribe()
      }
    );
    
  }

  onDateChange(event) {
    const value = event.value;

    let today : Date = new Date();

    if (new Date(event.value) < today){
      this.invalidDate = true;

    } else {
      this.invalidDate = false;
    }
  }
}
