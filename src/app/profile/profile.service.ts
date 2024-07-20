import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Profile } from "./profile.model";

@Injectable({
    providedIn:'root'
})
export class ProfileService {
    currentProfileId = new BehaviorSubject<string>(null);
    currentProfileChanged = new BehaviorSubject<Profile>(null);
    profilesChanged = new Subject<Profile[]>();

    private profiles = [];

    setProfiles(profiles: Profile[]) {
        this.profiles = profiles;
        this.profilesChanged.next(this.profiles.slice());
    }

    getProfilesArrayLength() {
        return this.profiles.length;
    }

    getProfiles() {
       return this.profiles.slice();
    }

    setCurrentProfile(profile: Profile) {
        this.currentProfileChanged.next(profile);
    }

    addProfile(profile: Profile) {
        this.profiles.push(profile);
    }

    setCurrentProfileId(id: string) {
        this.currentProfileId.next(id);
    }
        
    
    
}