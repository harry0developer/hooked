import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fbService } from '../pages/services/fbService.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  user: any;
  constructor(
    private fbService: fbService,
    private router: Router
    ) { }

  ngOnInit() {
    this.user = this.fbService.userData;
  }

  goLoginPage(){
    this.router.navigate(["/signin"]);
  }


  completeVerification() {
    
  }
}
