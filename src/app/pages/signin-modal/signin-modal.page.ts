import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { map } from 'rxjs';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION, FIREBASE_ERROR, ROUTES, STATUS } from 'src/app/utils/const';

@Component({
  selector: 'app-signin-modal',
  templateUrl: './signin-modal.page.html',
  styleUrls: ['./signin-modal.page.scss'],
})
export class SigninModalPage implements OnInit {

  validations_form: FormGroup;
  signin_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

  validation_messages = {
    'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };
 
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
  ) { } 

  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
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
  }
  

  async signin() {
    const loading = await this.loadingCtrl.create( {message:"Signing in, please wait..."});
    await loading.present();

    const status = await this.firebaseService.login(this.email, this.password);

    await loading.dismiss();

    if(status ===  STATUS.SUCCESS) {
      this.modalCtrl.dismiss();
      this.router.navigateByUrl(ROUTES.USERS, {replaceUrl: true})
    } else {

      if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNIN_INCORRECT_PASSWORD.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNIN_INCORRECT_PASSWORD.value);
      }
      else if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNIN_USER_NOT_FOUND.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNIN_USER_NOT_FOUND.value);
      } 
      else if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNI_BLOCKED.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNI_BLOCKED.value);
      } else {
        this.showAlert("Login failed",  FIREBASE_ERROR.SINGIN_GENERIC);

      }
    }
  } 

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

  cancel() {
    // this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl: true})
    this.modalCtrl.dismiss();
  }  
 

}
