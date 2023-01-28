
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { User } from '../models/User';
var moment = require('moment'); // require

@Injectable()
export class DataService {

 
  users: any[] = [

    {
      id: "1",
      uid: "UUID-001-001",
      email: "user1@test.com",
      phone: "+27821002000",
      name: "Amanda Du Pont",
      dob: "01/25/1995", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user1/1.jpg",
        "../../assets/users/user1/2.jpg",
        "../../assets/users/user1/3.jpg",
        "../../assets/users/user1/4.jpg"
      ],
      location: {
          address: "Midrand",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
    },
    {
      id: "2",
      uid: "UUID-000-002",
      email: "user2@test.com",
      phone: "+27821003000",
      name: "Simba Potter",
      dob: "01/25/1999", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user2/1.jpg",
        "../../assets/users/user2/2.jpg",
        "../../assets/users/user2/3.jpg",
        "../../assets/users/user2/4.jpg"
      ],
      location: {
          address: "Daveyton",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
    },
    {
      id: "3",
      uid: "UUID-000-003",
      email: "user3@test.com",
      phone: "+27821003000",
      name: "Thato Seku",
      dob: "01/25/1999", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user3/1.jpg",
        "../../assets/users/user3/2.jpg",
        "../../assets/users/user3/3.jpg",
        "../../assets/users/user3/4.jpg"
      ],
      location: {
          address: "Diepsloot",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
    },
    {
      id: "4",
      uid: "UUID-000-004",
      email: "user4@test.com",
      phone: "+27739993000",
      name: "Thato Seku",
      dob: "05/15/1996", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user3/1.jpg",
        "../../assets/users/user3/2.jpg",
        "../../assets/users/user3/3.jpg",
        "../../assets/users/user3/4.jpg"
      ],
      location: {
          address: "Mpumalanga",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
    },
    {
      id: "5",
      uid: "UUID-000-005",
      email: "user5@test.com",
      phone: "+27737776000",
      name: "Nadia Sexy",
      dob: "01/19/2000", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user4/1.jpg",
        "../../assets/users/user4/2.jpg",
        "../../assets/users/user4/3.jpg",
        "../../assets/users/user4/4.jpg"
      ],
      location: {
          address: "Mpumalanga",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
    },
    {
      id: "6",
      uid: "UUID-000-005",
      email: "user5@test.com",
      phone: "+27739090000",
      name: "Skyler White",
      dob: "01/19/2000", //moment().format('L');    // 01/19/2023
      gender: "female",
      images: [
        "../../assets/users/user5/1.jpg",
        "../../assets/users/user5/2.jpg",
        "../../assets/users/user5/3.jpg",
        "../../assets/users/user5/4.jpg"
      ],
      location: {
          address: "Pretoria",
          geo: {
              lat: 10.000,
              lng: -85.00
          }
      },
      dateCreated: moment().format()
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

  getUser(uid: string): User {
    return this.users.filter(u => this.getId(u.uid) === uid)[0];
  }

  getId(id: string): string{
    return 'card-'+id;
  }

  getUsers(): User[] {
    return this.users;
  }

}