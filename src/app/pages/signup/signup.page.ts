import {  Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FbService } from '../services/fbService.service';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
import { IonModal } from '@ionic/angular';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, onSnapshot } from '@angular/fire/firestore';
import { ref, Storage } from '@angular/fire/storage';
import { Camera,  CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { docChanges } from '@angular/fire/compat/firestore';
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
 currentUser: any;

 uploadedImages: any;

 @ViewChild('modal') modal: IonModal;

  constructor(
    private formBuilder: FormBuilder,
    private fbService: FbService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private auth: Auth,
    private storage: Storage,
    private firestore: Firestore,



  ) { } 

  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
  }

  get dob() {
    return this.validations_form.get('dob')?.value;
  }

  get gender() {
    return this.validations_form.get('gender')?.value;
  }
  get orientation() {
    return this.validations_form.get('orientation')?.value;
  }
  get name() {
    return this.validations_form.get('name')?.value;
  }
 

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
    // import { doc, onSnapshot } from "firebase/firestore";

    // const userDocRef = doc(this.firestore, currentUser.uid)

  

    // this.uploadedImages = this.fbService.afs.collection(COLLECTION.images).valueChanges();
  }

  async uploadImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {

      // const result = await this.avatarService.uploadImage(this.user, image);

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

  async addUserToFirebaseDataStore() {
    let user: User;
    const currentUser = this.auth.currentUser;
    user  = { 
      uid: currentUser.uid,
      email: currentUser.email,
      name: this.name,
      gender: this.gender,
      dob: this.dob,
      orientation: this.orientation,
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
     
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.fbService.addDocumentToFirebase(COLLECTION.users, user).then(res => {
      console.log(res);
      
    }).catch(err => {
      console.log(err);
    })
    // this.fbService.addItem(COLLECTION.users, user, user.uid).then(() => {
    //   console.log('User added successfully');
    //   loading.dismiss();

    //   this.modal.dismiss().then(() => {
    //     this.router.navigateByUrl('/tabs/users', {replaceUrl: true})
    //     this.profileInComplete = false;
    //     this.fbService.setStorage(STORAGE.INCOMPLETE_PROFILE, this.profileInComplete);
    //   });
    // }).catch(err => {
    //   console.log(err);
    // });
    
  }
 
  async registerOnFirebase() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const user = await this.fbService.register(this.email, this.password);
    await loading.dismiss();

    if(user) {
      ++this.activeStep;

      // this.router.navigateByUrl('/tabs/users', {replaceUrl: true})
    } else {
      this.showAlert("Registration failed", "Please try again");
    }
  }

  XXXsignUpOnFirebase() {
    this.fbService.register(this.validations_form.value.email, this.validations_form.value.password).then(u => {
      this.fbService.setStorage(STORAGE.FIREBASE_USER, u);
      ++this.activeStep;
    }).catch(err => {
      console.log(err);
      // if(err && err.message && this.fbService.findInString(err.message, FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED)) {        
      //   this.errorMessage = FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED;
      // }
      // else if(err && err.message && this.fbService.findInString(err.message, FIREBASE_ERROR.PASSWORD_TOO_SHORT)) {
      //   this.errorMessage = FIREBASE_ERROR.PASSWORD_TOO_SHORT;
      // }else {
      //   this.errorMessage = FIREBASE_ERROR.GENERIC_SIGNINP
      // }
      
    })
  }
  

  goToSignInPage() {
    this.modal.dismiss().then(() => this.router.navigate(['/signin']));
  }  

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Ok']
    })

    await alert.present();
  }

}
