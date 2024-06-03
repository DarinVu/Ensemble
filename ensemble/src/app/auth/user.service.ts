import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userInProgress = new Subject<Object>();

    public setUserInProgress(user: Object) {
        this.userInProgress.next(user);
    }
}