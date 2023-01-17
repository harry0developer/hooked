import { Component } from '@angular/core';
import { User } from 'src/app/models/User';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage {

  
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
      "age": 27,
      "name": "Kamo Mphela",
      "gender": "female",
      "location": "Pretoria",
      "distance": "30"
    },
    {
      "id": "4",
      "images": [
        "../../assets/users/user3/1.jpg",
        "../../assets/users/user3/2.jpg",
        "../../assets/users/user3/3.jpg",
        "../../assets/users/user3/4.jpg"
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


  constructor(private gallery: Gallery) {}

  showGallery(index: number) {
    let prop = {
        images: [
            {path: "../../assets/users/user01.jpg"},
            {path: "../../assets/users/user02.jpg"},
            {path: "../../assets/users/user03.jpg"},
            {path: "../../assets/users/user4.jpg"},
        ],
        index,
        counter: true,
        arrows: false
    };
    this.gallery.load(prop);
  }
}
