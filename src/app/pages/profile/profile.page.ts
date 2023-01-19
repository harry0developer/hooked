import { Component } from '@angular/core';
import { User } from '../../models/User';
import { Gallery } from 'angular-gallery';
var moment = require('moment'); // require

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  user:User = {
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
  };
  constructor(private gallery: Gallery) {}

  getUserAge(): string {
    return moment().diff(this.user.dob, 'years');
  }
  
  showGallery(index: number) {
    let prop = {
        images: [
            {path: "../../assets/users/user3/1.jpg"},
            {path: "../../assets/users/user3/2.jpg"},
            {path: "../../assets/users/user3/3.jpg"},
        ],
        index,
        counter: true,
        arrows: false
    };
    this.gallery.load(prop);
  }

}
