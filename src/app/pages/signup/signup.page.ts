import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { FirebaseService } from '../services/firebase.service';
import { fbService } from '../services/fbService.service';
import { FIREBASE_ERROR } from 'src/app/utils/const';
 

var moment = require('moment'); // require

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {


  myDate ;
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  activeStep: number = 0;

  validation_messages = {
  //  'email': [
  //    { type: 'required', message: 'Email is required.' },
  //    { type: 'pattern', message: 'Enter a valid email.' }
  //  ],
   'name': [
    { type: 'required', message: 'Name is required.' },
    { type: 'minlength', message: 'Name must be at least 4 characters long.' }
  ],
  //  'password': [
  //    { type: 'required', message: 'Password is required.' },
  //    { type: 'minlength', message: 'Password must be at least 6 characters long.' }
  //  ]
  };



  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private fbService: fbService,
    private router: Router
  ) { }

  showdate() {}
 
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      // gender: new FormControl('', Validators.compose([
      //   Validators.required
      // ])),
      // email: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])),
     
      // password: new FormControl('', Validators.compose([
      //   Validators.minLength(6),
      //   Validators.required
      // ])),
    });
  }

  parseDate(dateString: string): Date {
    if (dateString) {
        return new Date(dateString);
    }
    return null;
}

  trySignup(user) {
    this.fbService.SignUp(user).then(result => {
      console.log(result);
      this.fbService.SendVerificationMail().then(user => {
        this.router.navigate(["/verify-email"]);
      }).catch(err => {
        console.log(err);
        this.errorMessage = FIREBASE_ERROR.VERIFICATION
      })

      // this.fbService.SetUserData(result.user, user.name).then(res => {
      //   console.log("User stored", res);
      // }).catch(err => {
      //   console.log("Could not store user", err);
      //   this.errorMessage = FIREBASE_ERROR.GENERIC_STORE_DATA;
      // })
      
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

 
  submit(e) {}

  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }
  next() {
    ++this.activeStep;
  }

  selectChange(e) {
    console.log(e);
  }
  
  // trySignup(value){

  //   let user: User = {
  //     id: "5",
  //     uid: "UUID-000-005",
  //     email: value.email,
  //     phone: null,
  //     name: value.email,
  //     dob: "01/19/2000", //moment().format('L');    // 01/19/2023
  //     gender: value.gender,
  //     images: [
  //       "../../assets/users/user4/1.jpg",
  //       "../../assets/users/user4/2.jpg",
  //       "../../assets/users/user4/3.jpg",
  //       "../../assets/users/user4/4.jpg"
  //     ],
  //     location: {
  //         address: "Mpumalanga",
  //         geo: {
  //             lat: 10.000,
  //             lng: -85.00
  //         }
  //     },
  //     dateCreated: moment().format()
  //   }
  //   this.authService.doRegister(value).then(res => {

      

  //     //  this.firebaseService.sendEmailVerification()
  //     //  this.errorMessage = "";
  //     //  this.successMessage = "Your account has been created. Please log in.";
  //    }, err => {
  //      console.log(err);
  //      this.errorMessage = err.message;
  //      this.successMessage = "";
  //    })
  // }

  // goLoginPage(){
  //   this.router.navigate(["/signin"]);
  // }

  //   // Send email verfificaiton when new user sign up
  // private SendVerificationMail() {

  //   this.firebaseService.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });

      
  // }


 
}
