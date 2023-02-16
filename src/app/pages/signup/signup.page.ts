import {  Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ROUTER_CONFIGURATION } from '@angular/router';
import { User } from 'src/app/models/User';
import { COLLECTION, ROUTES, STORAGE } from 'src/app/utils/const';
import { IonModal, ModalController } from '@ionic/angular';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { Camera,  CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FirebaseService } from 'src/app/service/firebase.service';
import { SignupModalPage } from '../signup-modal/signup-modal.page';
var moment = require('moment'); // require


interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validations_form: FormGroup;
  signup_form: FormGroup;

  errorMessage: string = '';
  activeStep: number = 0;


  validation_messages = {
   'name': [
     { type: 'required', message: 'Name is required.' },
     { type: 'minlength', message: 'Name must be at least 4 characters long.' }
   ],
   'email': [
    { type: 'required', message: 'Email is required.' },
    { type: 'pattern', message: 'Please enter a valid email.' }
  ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 6 characters long.' }
   ]
 };


 images: LocalFile[] = [];

 profilePicture: string;

 user: User;

 currentUser: any;

 uploadedImages: any;


  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController, 
  ) { } 
 
  ngOnInit() {}
  

  goToSignInPage() {
    this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl: true})
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


 
}
