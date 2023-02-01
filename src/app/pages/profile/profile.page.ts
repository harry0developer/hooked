import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/User';
import { Gallery } from 'angular-gallery';
import { FbService } from '../services/fbService.service';
import { STORAGE } from 'src/app/utils/const';
import { IonModal, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SettingsModalPage } from '../settings-modal/settings-modal.page';
var moment = require('moment'); // require

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit{
 
  // user:User = {
  //   uid: "UUID-000-004",
  //   email: "user4@test.com",
  //   phone: "+27739993000",
  //   name: "Thato Seku",
  //   dob: "05/15/1996", //moment().format('L');    // 01/19/2023
  //   gender: "female",
  //   profile_picture: "",
  //   orientation: "",
  //   images: [
  //     "../../assets/users/user3/1.jpg",
  //     "../../assets/users/user3/2.jpg",
  //     "../../assets/users/user3/3.jpg",
  //     "../../assets/users/user3/4.jpg"
  //   ],
  //   location: {
  //       address: "Mpumalanga",
  //       geo: {
  //           lat: 10.000,
  //           lng: -85.00
  //       }
  //   },
  //   dateCreated: moment().format(),
  //   isVerified: false
  // };

  user: User;
  constructor(
    private gallery: Gallery, 
    private fbService: FbService,
    private modalCtrl: ModalController,
    private router: Router) {
    this.user = this.fbService.getStorage(STORAGE.USER);
  }


  ngOnInit(): void {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModalPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log("confirmed");
      
    }
  }

  getUserAge(): string {
    return moment().diff(this.user.dob, 'years');
  }


 

  signOut() {
    this.fbService.signOut().then(() => {
      this.router.navigate(['signin']);
    })
  }
  onWillDismiss(e) {
    console.log(e);
    
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
