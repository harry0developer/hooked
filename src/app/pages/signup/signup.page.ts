import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FirebaseService } from '../services/old-firebase.service';
import { FbService } from '../services/fbService.service';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
import { IonModal } from '@ionic/angular';
 

var moment = require('moment'); // require

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, AfterViewInit {

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


 @ViewChild('modal') modal: IonModal;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private fbService: FbService,
    private router: Router
  ) { }


  ngAfterViewInit(): void {
    // console.log(this.modal);

  }
  

  ngOnInit() {
    console.log(this.modal);

    
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
    
    let user: User = {
      uid: firebaseUser.user.uid,
      email: firebaseUser.user.email,
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      orientation: formData.orientation,
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
    this.fbService.setStorage(STORAGE.USER, user);

    this.fbService.addItem(COLLECTION.users, user, user.uid).then(() => {
      console.log('User added successfully');
      //Redirect with routerLink in the html
      this.modal.dismiss().then(() => this.router.navigate(['/tabs/users']));

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
