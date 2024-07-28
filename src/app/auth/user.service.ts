import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userInProgress = new BehaviorSubject<Object>(null);
    // private userInProgress: Object

    public setUserInProgress(user: Object) {
        this.userInProgress.next(user)
    }

    public getUserInProgress() {
        return this.userInProgress;
    }
}