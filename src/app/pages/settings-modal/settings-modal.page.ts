import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
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
  wantList = [];
  withList = [];
  dateOfBirth: string = "";
 

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private firebaseService: FirebaseService) {
    this.user = this.firebaseService.getStorage(STORAGE.USER);
  }

  
  
  ngOnInit() {
    this.init();
    
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

  init() {
    this.wantList = [];
    this.user.want.forEach(a => {
      if(a.toLocaleUpperCase() === "NSA") {
        this.wantList.push("No string attached");
      } else if(a.toLocaleUpperCase() === "FWB") {
        this.wantList.push("Friends with benefits");
      }
      else if(a.toLocaleUpperCase() === "ONS") {
        this.wantList.push("One night stand");
      }
    }); 

    this.dateOfBirth = this.user.dob.split("T")[0];

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