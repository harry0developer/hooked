import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimationItem } from 'lottie-web';
import { AnimationLoader, AnimationOptions, provideLottieOptions } from 'ngx-lottie';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';
import { STORAGE } from 'src/app/utils/const';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader,
  ],
})
export class MatchPage implements OnInit{

  @Input() user: User;
  me: User;
  options: AnimationOptions = {    
    path: '/assets/animations/fireworks.json'  
  };  
  
  constructor(private modalCtrl: ModalController, private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.me = this.firebaseService.getStorage(STORAGE.USER);
    console.log("Components props, USER: ", this.user);
    console.log("Components props, ME: ", this.me);
  }
 
  openChats() {}

  onAnimate(): void {    
    console.log("Animating...");  
  }

  continueSwipping() {
    return this.modalCtrl.dismiss(null, 'swipe');
  }

  startChatting() {
    return this.modalCtrl.dismiss(null, 'chat');
  }
}
