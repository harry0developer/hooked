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

  createAccountOnFirebase() {
    const storageData = this.fbService.getStorage(STORAGE.USER);
    let user: User = this.validations_form.value;
    user.email = storageData.email;
    user.name = storageData.name;

    this.fbService.setStorage(STORAGE.USER, user);
    this.fbService.storeUserOnFirebase(user).then(res => {
      console.log(res);
      this.router.navigate(['/tabs/users']).then(() => {
        //hide spinner
      }).catch(() => {
        //hide spinner;
      })
      
    }).catch(err => {
      console.log(err);
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

    // this.fbService.SignUp(this.validations_form.value).then(user => {
    //   console.log(user);
    //   this.fbService.setUserData(user, this.validations_form.value).then(res => {
    //     console.log(res);
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // })
  }
}
