import { Component } from '@angular/core'; 
import { ModalController } from '@ionic/angular';
import { InternetPage } from './pages/internet/internet.page';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private modalCtrl: ModalController) {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      if(!status.connected) {
        this.openInternetConnectionModal()
      }
    });
  }


  async openInternetConnectionModal() {
   const modal = await this.modalCtrl.create({
      component: InternetPage,
    });
  
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'retry') {
      console.log("Re trying api calls");
    }
  } 
}
