import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  user: User;
  me: User;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  openChats() {}

  continueSwipping() {
    return this.modalCtrl.dismiss(null, 'swipe');
  }

  startChatting() {
    return this.modalCtrl.dismiss(null, 'chat');
  }
}
