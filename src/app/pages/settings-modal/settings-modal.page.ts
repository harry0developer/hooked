import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {

  name: string;

  user: User;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private firebaseService: FirebaseService) {
    this.user = this.firebaseService.getStorage(STORAGE.USER);


  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  ngOnInit() {
  }


  async logout() {
    await this.firebaseService.signout().then(() => {
      this.cancel();
      this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl:true})
    })
  }
}