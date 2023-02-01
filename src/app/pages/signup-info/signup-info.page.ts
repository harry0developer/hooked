import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { FirebaseService } from '../services/old-firebase.service';
import { FbService } from '../services/fbService.service';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
 

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
    private fbService: FbService,
    private router: Router,
    private activeRoute: ActivatedRoute,

  ) { 
       
  }

 
  ngOnInit() {
    this.data = this.fbService.getStorage(STORAGE.USER);
    console.log(this.data);
    
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

  cancel() {
    this.fbService.setStorage(STORAGE.USER, null);
    this.router.navigate(['/signin']);
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
