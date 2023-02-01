import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FirebaseService } from '../services/old-firebase.service';
import { FbService } from '../services/fbService.service';
import { FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
 

var moment = require('moment'); // require

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  validation_messages = {
  //  'name': [
  //    { type: 'required', message: 'Name is required.' },
  //    { type: 'minlength', message: 'Name must be at least 4 characters long.' }
  //  ],
   'email': [
    { type: 'required', message: 'Email is required.' },
    { type: 'pattern', message: 'Please enter a valid email.' }
  ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 6 characters long.' }
   ]
 };
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private fbService: FbService,
    private router: Router
  ) { }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      // name: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(4)
      // ])),
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

  createAccount() {
    const u = this.validations_form.value;
   
    this.fbService.SignUp(u.email, u.password).then(res => {
      this.fbService.setStorage(STORAGE.FIREBASE_USER, res);
      this.router.navigate(['/signup-info']);
      
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
    this.router.navigate(['/signin'])
  }

}
