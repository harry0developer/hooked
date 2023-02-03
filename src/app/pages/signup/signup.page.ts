import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FirebaseService } from '../services/old-firebase.service';
import { FbService } from '../services/fbService.service';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
 

var moment = require('moment'); // require

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


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private fbService: FbService,
    private router: Router
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


  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }

  next() {
    ++this.activeStep;
    console.log(this.validations_form.value);
  }



  createAccountOnFirebase() {
    let user: any = this.validations_form.value;
    const firebaseUser = this.fbService.getStorage(STORAGE.FIREBASE_USER);
    console.log(firebaseUser);
    
    let userData: User = {
      uid: firebaseUser.user.uid,
      email: firebaseUser.user.email,
      name: user.name,
      gender: user.gender,
      dob: user.dob,
      orientation: user.orientation,
      profile_picture: "",
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
    this.fbService.setStorage(STORAGE.USER, userData);

    this.fbService.addItem(COLLECTION.users, userData, userData.uid).then(() => {
      console.log('User added successfully');
      this.router.navigate(["/tabs/users"]);
    }).catch(err => {
      console.log(err);
    });
    
  }
  

  goToSignInPage() {
    this.router.navigate(['/signin'])
  }

  signupModal(){ 
    this.router.navigate(['/signin'])
  }

}
