import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { FirebaseService } from '../services/firebase.service';
import { fbService } from '../services/fbService.service';
import { FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
 

var moment = require('moment'); // require

@Component({
  selector: 'app-signup-info',
  templateUrl: './signup-info.page.html',
  styleUrls: ['./signup-info.page.scss'],
})
export class SignupInfoPage implements OnInit {


  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  activeStep: number = 0;

  validation_messages = {
   'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' }
    ],
   'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],
   'dob': [
      { type: 'required', message: 'Gender is required.' }
    ],
    'orientation': [
      { type: 'required', message: 'Sexual Orientation is required.' }
    ]
  };

  data: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private fbService: fbService,
    private router: Router,
    private activeRoute: ActivatedRoute,

  ) { }

 
  ngOnInit() {
    this.data = this.fbService.getStorage(STORAGE.USER);
    
    this.validations_form = this.formBuilder.group({
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

  trySignup(user) {
    this.fbService.SignUp(user.email, user.password).then(result => {
      console.log(result);
      this.fbService.SendVerificationMail().then(user => {
        this.router.navigate(["/verify-email"]);
      }).catch(err => {
        console.log(err);
        this.errorMessage = FIREBASE_ERROR.VERIFICATION
      }) 
    }).catch(err => {
      console.log(err.message);
      if(this.fbService.findInString(err.message, FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED)) {        
        this.errorMessage = FIREBASE_ERROR.EMAIL_ALREADY_REGISTERED;
      }
      else if(this.fbService.findInString(err.message, FIREBASE_ERROR.PASSWORD_TOO_SHORT)) {
        this.errorMessage = FIREBASE_ERROR.PASSWORD_TOO_SHORT;
      }else {
        this.errorMessage = FIREBASE_ERROR.GENERIC_SIGNINP
      }
      
    })
  }
  
  goLoginPage(){
    this.router.navigate(["/signin"]);
  }

  startSignUp(user) {
    this.router.navigate(['/signup-info']);
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

  submit() {
    const email = "test@email.com";
    const password = "P@ssword";
    this.fbService.SignUp(email, password).then(user => {
      console.log(user);
      
    })
  }
}
