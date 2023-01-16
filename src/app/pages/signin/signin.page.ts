import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { AUTH_TYPE } from 'src/app/utils/const';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  loginData = {
    email: "",
    passoword: ""
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    
  }
  login(type:string) {
    if(type == AUTH_TYPE.google) {
      // this.authService.GoogleAuth().then(user => {
      //   console.log(user);
      // })
    } else if(type == AUTH_TYPE.email) {
      this.authService.SignIn(this.loginData.email, this.loginData.passoword).then(user => {
        console.log(user);
      }).catch(e => {
        console.log(e);
        
      })
    }  else if(type == AUTH_TYPE.phone) {
      // this.authService. .then(user => {
      //   console.log(user);
      // })
    }  
  }
}