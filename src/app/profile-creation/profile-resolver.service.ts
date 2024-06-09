import { Injectable } from "@angular/core";
import { ProfileService } from "./profile.service";
import { ProfileStorageService } from "./profile-storage.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileResolverService {
    constructor(private profileService: ProfileService, private profileStorageService: ProfileStorageService) {}


    resolve() {
        if (this.profileService.getProfiles().length === 0) {
            return this.profileStorageService.fetchProfiles();
        }
        }
    
}
