import { Component } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  user: User =  {
    "id": "0",
    "picture": "../../assets/users/user2.jpg",
    "age": 23,
    "name": "Amanda Du Pont",
    "gender": "female",
    "location": "Midrand",
    "distance": "22"
  };
  constructor() {}

}
