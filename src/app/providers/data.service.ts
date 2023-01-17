
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { User } from '../models/User';

@Injectable()
export class DataService {

 
  users: User[] = [
    {
      "id": "0",
      "images": [
        "../../assets/users/user1/1.jpg",
        "../../assets/users/user1/2.jpg",
        "../../assets/users/user1/3.jpg",
        "../../assets/users/user1/4.jpg"
      ],
      "age": 23,
      "name": "Amanda Du Pont",
      "gender": "female",
      "location": "Midrand",
      "distance": "22"
    },
    {
        "id": "1",
        "images": [
          "../../assets/users/user2/1.jpg",
          "../../assets/users/user2/2.jpg",
          "../../assets/users/user2/3.jpg",
          "../../assets/users/user2/4.jpg"
        ],
        "age": 28,
        "name": "Simba Potter",
        "gender": "female",
        "location": "Sandton",
        "distance": "12"
    },
    {
      "id": "2",
      "images": [
        "../../assets/users/user3/1.jpg",
        "../../assets/users/user3/2.jpg",
        "../../assets/users/user3/3.jpg",
        "../../assets/users/user3/4.jpg"
      ],
      "age": 24,
      "name": "Thato Seku",
      "gender": "female",
      "location": "Pretoria",
      "distance": "9"
    },
    {
      "id": "4",
      "images": [
        "../../assets/users/user4/1.jpg",
        "../../assets/users/user4/2.jpg",
        "../../assets/users/user4/3.jpg",
        "../../assets/users/user4/4.jpg"
      ],
      "age": 24,
      "name": "Nadia Lou",
      "gender": "female",
      "location": "Daveyton",
      "distance": "62"
    },
    {
      "id": "5",
      "images": [
        "../../assets/users/user5/1.jpg",
        "../../assets/users/user5/2.jpg",
        "../../assets/users/user5/3.jpg",
        "../../assets/users/user5/4.jpg"
      ],
      "age": 21,
      "name": "Lucy Smith",
      "gender": "female",
      "location": "Pretoria",
      "distance": "39"
    }];

  user: User = this.users[0];
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

  getUser(id: string): User {
    return this.users.filter(u => this.getId(u.id) === id)[0];
  }

  getId(id: string): string{
    return 'card-'+id;
  }

  getUsers(): User[] {
    return this.users;
  }

}