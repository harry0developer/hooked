import { Component } from '@angular/core';
import { User } from 'src/app/models/User';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  user: User =  {
    "id": "4",
    "images": [
      "../../assets/users/user3/1.jpg",
      "../../assets/users/user3/2.jpg",
      "../../assets/users/user3/3.jpg"
    ],
    "age": 24,
    "name": "Thato Seku",
    "gender": "female",
    "location": "Daveyton",
    "distance": "62"
  };
  constructor(private gallery: Gallery) {}
  
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
