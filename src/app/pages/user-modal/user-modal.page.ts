import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  user: User = {
    uid: "UUID-000-002",
    email: "user2@test.com",
    phone: "+27821003000",
    orientation: "gay",
    profile_picture: "../../assets/users/user2/1.jpg",
    name: "Simba Potter",
    dob: "01/25/1999", //moment().format('L');    // 01/19/2023
    gender: "female",
    want: ["ONS"],
    with: ["male", "female"],
    images: [
      "../../assets/users/user2/1.jpg",
      "../../assets/users/user2/2.jpg",
      "../../assets/users/user2/3.jpg",
      "../../assets/users/user2/4.jpg"
    ],
    location: {
      distance: '23',
        geo: {
            lat: 10.000,
            lng: -85.00
        }
    },
    isVerified: false
  };
  constructor(private gallery: Gallery) { }

  ngOnInit() {
  }

  showGallery(index: number) {
    let imgs = [];
    for(let img of this.user.images ) {
      imgs.push({path: img})
    }
    let prop = {
        images: imgs,
        index,
        counter: true,
        arrows: false
    };
    this.gallery.load(prop);
  }


}
