import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { COLLECTION, FIREBASE_ERROR, STORAGE } from 'src/app/utils/const';
import { FbService } from '../services/fbService.service';
 
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
    private fbService: FbService,
    private formBuilder: FormBuilder,
    private router: Router
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

  tryLogin(value){
    this.fbService.SignIn(value.email, value.password).then(res => {
      
      this.fbService.getItemById(COLLECTION.users, res.user['uid']).subscribe(user => {
        console.log("SIGNIN USER", user);
        
        this.fbService.setStorage(STORAGE.USER, user);     
        this.router.navigate(["/tabs/profile"]);
      },err => {
        console.log(err);
      })
    }, err => {
      this.errorMessage = FIREBASE_ERROR.SIGNIN_USERNAME_PASSWORD//err.message;
      console.log(err)
    })
  }

  goToSignupPage(){
    this.router.navigate(["/signup"]);
  }
  goToResetPassword() {
    this.router.navigate(["/reset-password"]);
  }
}
