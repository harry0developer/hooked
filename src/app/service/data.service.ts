import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/User';

@Injectable({
    providedIn: 'root',
})
export class DataService {
  
  private chats = new BehaviorSubject<Message[] | null>(null);
  chats$ = this.chats.asObservable();

  setChats(chats: Message[]) {
    this.chats.next(chats);
  }
}