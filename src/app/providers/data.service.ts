
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscribable, Subscription } from 'rxjs';
import { User } from '../models/User';

@Injectable()
export class DataService {

  user: User = {
    id: "",
    picture: "",
    age: 0,
    name: "",
    gender: "",
    distance: "",
    location: ""
  };

 users: User[] = [
    {
      "id": "0",
      "picture": "../../assets/users/user2.jpg",
      "age": 23,
      "name": "Amanda Du Pont",
      "gender": "female",
      "location": "Midrand",
      "distance": "22"
    },
    {
        "id": "1",
        "picture": "../../assets/users/user6.jpg",
        "age": 28,
        "name": "Simba Potter",
        "gender": "female",
        "location": "Sandton",
        "distance": "12"
    },
    {
        "id":"2",
        "picture": "../../assets/users/user5.jpg",
        "age": 31,
        "name": "Kamo Mphela",
        "gender": "female",
        "location": "Pretoria",
        "distance": "52"
    }];
 
  private count: number = this.users.length;
  private likedUsers = new BehaviorSubject( this.user );
  private disLikedUser = new BehaviorSubject( this.user );
  private userCount = new BehaviorSubject( this.count );

  likedUser$ = this.likedUsers.asObservable();
  disLikedUser$ = this.disLikedUser.asObservable();
  userCount$ = this.userCount.asObservable();

  constructor() { }


  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getItem(key: string) {
    JSON.parse(localStorage.getItem(key) || '{}');
  }

  addLikedUser(id: string) {
    this.likedUsers.next(this.getUser(id));
    this.userCount.next(--this.count);
  }

  addDisLikedUser(id: string) {
    this.disLikedUser.next(this.getUser(id));
    this.userCount.next(--this.count);
  }

  getCount(){
    return this.userCount$;
  }
  getUser(id: string): User {
    return this.users.filter(u => this.getId(u.id) === id)[0];
  }

  getId(id: string): string{
    return 'card-'+id;
  }

}