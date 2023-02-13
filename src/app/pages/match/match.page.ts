import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

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
