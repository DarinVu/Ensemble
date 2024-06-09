import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profile } from "./profile.model";
import { tap } from "rxjs";
import { ProfileService } from "./profile.service";
import { Ensemble } from "../ensembles/ensemble.model";

@Injectable({
    providedIn: 'root'
})
export class ProfileStorageService {
    private profileId: string;

    constructor(private http: HttpClient, private profileService: ProfileService) {}

    storeProfile(profile: Profile) {
        this.http.post('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles.json', profile).subscribe();
    }

    fetchProfiles() {
        return this.http.get('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles.json')
        .pipe(tap(profiles => {
            let profilesArray = []
            for (var key in profiles) {
                if (profiles.hasOwnProperty(key)) {
                    this.profileId = key;
                    var profileObj = {};
                    profileObj[this.profileId] = profiles[key];
                    profilesArray.push(profileObj);
                }
            }
            this.profileService.setProfiles(profilesArray);
        })
    )}

    addEnsembleToProfile(ensembles: Ensemble[]) {
        this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles/' + this.profileId + '.json',
            {
                'ensembles': ensembles
            }
        ).subscribe(
            data => {
                console.log(data);
            }
        );
    }
}