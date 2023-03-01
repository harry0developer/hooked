import { Component } from '@angular/core'; 
import { LoadingController, ModalController } from '@ionic/angular';
import { InternetPage } from './pages/internet/internet.page';
import { Network } from '@capacitor/network';
import { LocationService } from './service/location.service';
import { Location } from './models/Location';
import { LocationPage } from './pages/location/location.page';
import { COLLECTION, SERVICE, STORAGE } from './utils/const';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  location: Location;
  constructor(
    private locationService: LocationService,
    private loadingCtrl:LoadingController,
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController) {

      // Network.addListener('networkStatusChange', status => {
      //   console.log('Network status changed', status);
      //   if(!status.connected) {
      //     this.openModal(SERVICE.CONNECTION)
      //   }
      // });

      // this.getLocation();
  }


  async openModal(name: string) {
    let genericModal;
     if(name == SERVICE.CONNECTION) {
      genericModal = await this.modalCtrl.create({
        component: InternetPage,
      });
    } else if(name == SERVICE.LOCATION) {
      genericModal = await this.modalCtrl.create({
        component: LocationPage,
      });
    }
    genericModal.present();
    const { data, role } = await genericModal.onWillDismiss();
    if (role === 'retry') {
      console.log("retry");
    }
  } 


  async getLocation() {
    // const loading = await this.loadingCtrl.create({message: "Getting location..."});
    // await loading.present();
    this.locationService.printCurrentPosition().then((res:any )=> {
     
      this.location = {
        lat: res.coords.latitude,
        lng: res.coords.latitude
      };

      this.firebaseService.setStorage(STORAGE.LOCATION, this.location);

      
      // this.users = this.getUsersWithLocation(this.location.lat, this.location.lng);
      // this.users = this.locationService.applyHaversine(this.users, res.coords.latitude, res.coords.longitude);
      // console.log(this.users);
      
      // loading.dismiss();
    }).catch(err => {
      console.log(err); //permision denied
      this.openModal(SERVICE.LOCATION);

      // loading.dismiss();
    });
  }

}
