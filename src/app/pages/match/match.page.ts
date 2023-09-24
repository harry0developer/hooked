import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  user: User;
  me: User;
  constructor(private modalCtrl: ModalController, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getCurrentUser().then((user: User) => {
      this.me = user; 
    }).catch(err => {
      console.log(err);
    });
  }

  openChats() {}

  continueSwipping() {
    return this.modalCtrl.dismiss(null, 'swipe');
  }

  startChatting() {
    return this.modalCtrl.dismiss(null, 'chat');
  }
}
