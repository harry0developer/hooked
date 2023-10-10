import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular'; 
import { SignupModalPage } from '../signup-modal/signup-modal.page';
import { SigninModalPage } from '../signin-modal/signin-modal.page';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';
  
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor( 
    public actionSheetController: ActionSheetController, 
    private modalCtrl: ModalController, 
    private firebaseServcice: FirebaseService,
    private router: Router
  ) { } 
 
  ngOnInit() {
    const seenIntro = this.firebaseServcice.getStorage(STORAGE.SEEN_INTRO);
    if(!seenIntro) {
      this.router.navigateByUrl(ROUTES.INTRO);
    }
  } 

  async openSignupModal() {
    const modal = await this.modalCtrl.create({
      component: SignupModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  async openSigninModal() {
    const modal = await this.modalCtrl.create({
      component: SigninModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }
}
