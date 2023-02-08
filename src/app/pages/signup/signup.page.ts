import {  Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FbService } from '../services/fbService.service';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
import { IonModal } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

import { Camera,  CameraResultType, CameraSource, Photo } from '@capacitor/camera';
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

 profileInComplete: boolean;

 user: User;

 uploadedImages: any;

 @ViewChild('modal') modal: IonModal;

  constructor(
    private formBuilder: FormBuilder,
    private fbService: FbService,
    private router: Router,
    public actionSheetController: ActionSheetController,


  ) { } 


  ngOnInit() {    
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });

    this.signup_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
      dob: new FormControl('', Validators.compose([
        Validators.required
      ])),
      orientation: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.profileInComplete = this.fbService.getStorage(STORAGE.INCOMPLETE_PROFILE);
  
    if(this.profileInComplete) {
      this.activeStep = 1;
    }

    //Listern to image upload
    this.uploadedImages = this.fbService.afs.collection(COLLECTION.images).valueChanges();
  }

  async uploadImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {

      this.fbService.loading();
      // const result = await this.avatarService.uploadImage(this.user, image);
      this.fbService.dismissLoading();

      // this.user.images.push(`data:image/${image.format};base64,${image.base64String}`);
    }
  }
 
  async selectImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.uploadImage(CameraSource.Photos)
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadImage(CameraSource.Camera)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }

  next() {
    ++this.activeStep;
    console.log(this.validations_form.value);
  }

  addUserToFirebaseDataStore() {
    let formData: any = this.signup_form.value;

    const firebaseUser = this.fbService.getStorage(STORAGE.FIREBASE_USER);
    console.log(firebaseUser);
    let user: User;
    user  = { 
      uid: this.profileInComplete ? firebaseUser['uid'] : firebaseUser.user.uid,
      email: this.profileInComplete ? firebaseUser['email'] : firebaseUser.user.email,
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      orientation: formData.orientation,
      profile_picture: this.profilePicture,
      images: [],
      isVerified: false,
      location: {
        address: "",
        geo: {
          lat: 0,
          lng: 0
        }
      }
    }; 
     
    this.fbService.setStorage(STORAGE.USER, user);

    this.fbService.addItem(COLLECTION.users, user, user.uid).then(() => {
      console.log('User added successfully');
      this.modal.dismiss().then(() => this.router.navigate(['/tabs/users']));
      this.profileInComplete = false;
      this.fbService.setStorage(STORAGE.INCOMPLETE_PROFILE, this.profileInComplete);

    }).catch(err => {
      console.log(err);
    });
    
  }
 

  signUpOnFirebase() {

    this.fbService.SignUp(this.validations_form.value.email, this.validations_form.value.password).then(u => {
      this.fbService.setStorage(STORAGE.FIREBASE_USER, u);
      ++this.activeStep;
    }).catch(err => {
      console.log(err);
      if(err && err.message && this.fbService.findInString(err.message, FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED)) {        
        this.errorMessage = FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED;
      }
      else if(err && err.message && this.fbService.findInString(err.message, FIREBASE_ERROR.PASSWORD_TOO_SHORT)) {
        this.errorMessage = FIREBASE_ERROR.PASSWORD_TOO_SHORT;
      }else {
        this.errorMessage = FIREBASE_ERROR.GENERIC_SIGNINP
      }
      
    })
  }
  

  goToSignInPage() {
    this.modal.dismiss().then(() => this.router.navigate(['/signin']));
  } 


 

  

}
