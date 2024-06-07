import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ensemble } from '../ensemble.model';
import { EnsemblesStorageService } from '../ensembles-storage.service';
import { EnsemblesService } from '../ensembles.service';
import { Profile } from '../../profile-creation/profile.model';
import { ProfileService } from '../../profile-creation/profile.service';

@Component({
  selector: 'app-ensembles-create',
  templateUrl: './ensembles-create.component.html',
  styleUrl: './ensembles-create.component.css'
})
export class EnsemblesCreateComponent implements OnInit{
  ensembleSize: number;
  ensembleForm: FormGroup;
  currentProfile: Profile = null;
  
  constructor(
    private ensemblesStorageService: EnsemblesStorageService,
    private ensemblesService: EnsemblesService,
    private profileService: ProfileService
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
      }
    );
    console.log(this.currentProfile);
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
    const newEnsemble = new Ensemble(
      this.ensembleForm.value['name'],
      this.ensembleForm.value['date'],
      this.ensembleForm.value['time'],
      this.ensembleForm.value['description'],
      this.ensembleForm.value['size'],
      this.ensembleForm.value['instruments'],
      this.ensembleForm.value['genre'],
      this.ensembleForm.value['status']
    )

    this.ensemblesStorageService.storeEnsemble(newEnsemble);
    this.ensemblesService.addEnsemble(newEnsemble);
    
  }
}
