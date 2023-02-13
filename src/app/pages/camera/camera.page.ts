import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

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