import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/models';

@Injectable({
    providedIn: 'root',
})
export class DataService {
  
  private chats = new BehaviorSubject<Message[] | null>(null);
  chats$ = this.chats.asObservable();

  private newMessage = new BehaviorSubject<boolean>(false);
  newMessage$ = this.newMessage.asObservable();

  countries;
  flags
  constructor(public http: HttpClient) {
     
   }

  getCountries() {
    return this.http.get('assets/countries.json').forEach(c => {
      this.countries = c;      
    })
  }

  getFlags() {
    return this.http.get('assets/flags.json').forEach(f => {
      this.flags = f;      
    })
  }
  
  setChats(chats: Message[]) {
    this.chats.next(chats);
  }

  setNewMessage(newMessage: boolean) {
    this.newMessage.next(newMessage);
  }
  filterItems(searchTerm) {    
    return this.countries.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}