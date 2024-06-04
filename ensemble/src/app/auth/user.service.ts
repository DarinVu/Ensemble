import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userInProgress: Object

    public setUserInProgress(user: Object) {
        this.userInProgress = user;
    }

    public getUserInProgress() {
        return this.userInProgress;
    }
}