import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-internet',
  templateUrl: './internet.page.html',
  styleUrls: ['./internet.page.scss'],
})
export class InternetPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  openChats() {}

  dismiss() {
    return this.modalCtrl.dismiss(null, 'none');
  }

  tryAgain() {
    return this.modalCtrl.dismiss(null, 'try');
  }

 
}