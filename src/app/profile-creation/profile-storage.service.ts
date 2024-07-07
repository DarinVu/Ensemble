import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profile } from "./profile.model";
import { tap } from "rxjs";
import { ProfileService } from "./profile.service";
import { Ensemble } from "../ensembles/ensemble.model";
import { Request } from "../inbox/request.model";
import { EnsembleShort } from "../ensembles/ensembleShort.model";

@Injectable({
    providedIn: 'root'
})
export class ProfileStorageService {

    constructor(
        private http: HttpClient, 
        private profileService: ProfileService,
    ) {}

    storeProfile(profile: Profile) {
        this.http.post('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles.json', profile).subscribe();
    }

    fetchProfiles() {
        return this.http.get('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles.json')
        .pipe(tap(profiles => {
            let profilesArray = []
            for (var key in profiles) {
                if (profiles.hasOwnProperty(key)) {
                    let profileId = key;
                    var profileObj = {};
                    profileObj[profileId] = profiles[key];
                    profilesArray.push(profileObj);
                }
            }
            this.profileService.setProfiles(profilesArray);
        })
    )}

    addEnsembleToProfile(ensembles: EnsembleShort[], profileId: string) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles/' + profileId + '.json',
            {
                'ensembles': ensembles
            }
        )
    }

    addRequestToProfile(hostId: string, requests: Request[]) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles/' + hostId + '.json',
            {
                'requests': requests
            }
        )
    }

    editProfile(profileId: string, newProfile: Profile) {
        console.log(profileId + '     ' + newProfile);
        this.http.put('https://ensemble-163c3-default-rtdb.firebaseio.com/profiles/' + profileId + '.json',
            newProfile
        ).subscribe()
    }
   
}