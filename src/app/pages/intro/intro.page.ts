import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { STORAGE } from 'src/app/utils/const';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  goToSignUp() {
    this.firebaseService.setStorage(STORAGE.SEEN_INTRO, true);
    this.router.navigate(['/signup']);
  }

  goToLogin() {
    this.firebaseService.setStorage(STORAGE.SEEN_INTRO, true);
    this.router.navigate(['/signin']);
  }

}
