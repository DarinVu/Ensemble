import { Injectable } from "@angular/core";
import { Message } from "./message.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChatService { 
    chatChanged = new Subject<Message[]>();

    constructor() {}

    private chat = []

    setChat(chat: Message[]) {
        this.chat = chat;
        this.chatChanged.next(this.chat.slice(1, this.chat.length));
    }

    getChat() {
        return this.chat.slice(1, this.chat.length);
    }
}