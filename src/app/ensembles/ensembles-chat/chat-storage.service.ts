import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message } from "./message.model";
import { ProfileService } from "../../profile-creation/profile.service";

@Injectable({
    providedIn: 'root'
})
export class ChatStorageService {
    constructor(
        private http: HttpClient,
        private profileService: ProfileService
    ) {}

    storeMessage(messages: Message[], ensembleId: string) {
        var profileId: string = null;
        this.profileService.currentProfileId.subscribe(
            id => {
                profileId = id;
            }
        )

        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json', 
            {
                'chat': messages
            }
        )
    }
}