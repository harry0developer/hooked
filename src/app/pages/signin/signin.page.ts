import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FIREBASE_ERROR, ROUTES, STATUS } from 'src/app/utils/const';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() { 
 
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }


  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
  }

  async login() {
    const loading = await this.loadingCtrl.create( {message:"Signing in, please wait..."});
    await loading.present();

    const status = await this.firebaseService.login(this.email, this.password);

    await loading.dismiss();

    if(status ===  STATUS.SUCCESS) {
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
      header, message, buttons: ['Ok']
    })

    await alert.present();
  }

 
  goToSignupPage(){
    this.router.navigate(["/signup"]);
  }
  goToResetPassword() {
    this.router.navigate(["/reset-password"]);
  }
}
