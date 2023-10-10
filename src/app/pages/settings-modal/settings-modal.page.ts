import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';
import { PreferencesModalPage } from '../preferences-modal/preferences-modal.page';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {

  name: string;
  user: User;
  wantList = [];
  withList = [];
  dateOfBirth: string = "";
 
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private firebaseService: FirebaseService) {
  }

  ngOnInit() {}

  async openPreferencesModal() {
    const modal = await this.modalCtrl.create({
      component: PreferencesModalPage,
      componentProps: {
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("applied");
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Deactivate account',
      buttons: [
        {
          text: 'Deactivate',
          role: 'destructive',
          data: {
            action: 'deactivate',
          },
          handler: () => { this.logout() }
        }, 
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
 
  async logout() {
    await this.firebaseService.signout().then(() => {
      this.cancel();
      this.firebaseService.removeStorageItem(STORAGE.USER);
      this.firebaseService.removeStorageItem(STORAGE.USERS);
      this.firebaseService.removeStorageItem(STORAGE.SWIPES);
      this.router.navigateByUrl(ROUTES.AUTH, {replaceUrl:true})
    })
  }
}