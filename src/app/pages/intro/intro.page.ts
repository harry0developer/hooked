import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE } from 'src/app/utils/const';
import { FbService } from '../services/fbService.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(private router: Router, private fbService: FbService) { }

  ngOnInit() {
  }

  goToSignUp() {
    this.fbService.setStorage(STORAGE.SEEN_INTRO, true);
    this.router.navigate(['/signin']);
  }

}
