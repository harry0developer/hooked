import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/User';

@Injectable({
    providedIn: 'root',
})
export class DataService {
  
  private chats = new BehaviorSubject<Message[] | null>(null);
  chats$ = this.chats.asObservable();

  private newMessage = new BehaviorSubject<boolean>(false);
  newMessage$ = this.newMessage.asObservable();

  setChats(chats: Message[]) {
    this.chats.next(chats);
  }

  setNewMessage(newMessage: boolean) {
    this.newMessage.next(newMessage);
  }
}