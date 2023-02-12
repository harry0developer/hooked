import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { ROUTES, STORAGE } from 'src/app/utils/const';
import { FbService } from '../services/fbService.service';

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
    private fbService: FbService) {
    this.user = this.fbService.getStorage(STORAGE.USER);


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
    await this.fbService.signout().then(() => {
      this.cancel();
      this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl:true})
    })
  }
}