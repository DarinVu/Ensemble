import { ChatService } from './chat.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message } from "./message.model";
import { ProfileService } from "../../profile/profile.service";
import { tap } from "rxjs/operators";
import { EnsemblesService } from '../ensembles.service';

@Injectable({
    providedIn: 'root'
})
export class ChatStorageService {

    constructor(
        private http: HttpClient,
        private chatService: ChatService,
        private ensemblesService: EnsemblesService
    ) {}

    storeMessage(messages: Message[], ensembleId: string) {
        return this.http.patch('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '.json', 
            {
                'chat': messages
            }
        )
    }

    fetchMessages(ensembleId: string) {
        return this.http.get<Message[]>('https://ensemble-163c3-default-rtdb.firebaseio.com/ensembles/' + ensembleId + '/chat.json')
        .pipe(tap(chat => {
            this.chatService.setChat(chat);
        })
    )
    }
}