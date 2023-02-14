import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  ComponentRef,
} from "@angular/core";

import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { AlertController, IonCard, LoadingController, ModalController } from "@ionic/angular";
import { map, Subscription } from 'rxjs';

import { Geo, User } from '../../models/User';
import { Observable } from "rxjs";
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { ROUTES } from "src/app/utils/const";
import { MatchPage } from "../match/match.page";
import { FirebaseService } from "src/app/service/firebase.service";
import { LocationService } from "src/app/service/location.service";
import { ChatService } from "src/app/service/chat.service";
import { LocationPage } from "../location/location.page";
import { CameraPage } from "../camera/camera.page";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users;

  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  likeUsers: User[] = [];
  disLikeUsers: User[] = [];
  liked$!: Subscription;
  disLiked$!: Subscription;

  count$!: Observable<Number>;

  defaultImage = '../../../assets/default/default.jpg';



  location: Geo;
  addressError;

  locationPermission;
  constructor(
    private gestureCtrlService: GestureCtrlService,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalCtrl: ModalController,
    private auth: Auth,
    private locationService: LocationService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private chatService: ChatService
  ){}
    
  ngOnInit() { 
    this.locationService.checkLocationPermissions().then(perm => {
      console.log(perm);
      
    }).catch(err => {
      console.log(err);
      
    })
  }

  getUsersWithLocation(lat, lng) {
    return this.chatService.getUsers().pipe(
      map(res => this.locationService.applyHaversine(res, lat, lng))
    );
  }


  async getLocation() {
    const loading = await this.loadingCtrl.create({message: "Getting location..."});
    await loading.present();
    this.locationService.printCurrentPosition().then((res:any )=> {
     
      this.location = {
        lat: res.coords.latitude,
        lng: res.coords.latitude
      };
    // this.users = this.getUsersWithLocation(this.location.lat, this.location.lng);
      // this.users = this.locationService.applyHaversine(this.users, res.coords.latitude, res.coords.longitude);
      loading.dismiss();
    }).catch(err => {
      console.log(err); //permision denied
      this.openModal('location');

      loading.dismiss();
    });
  }

 
  filterUsers() {
    console.log("Filtering..");
  }


  async openModal(name: string) {

    let genericModal;
    if(name == 'filter') {
      genericModal = await this.modalCtrl.create({
        component: FilterPage,
      });
    }
    else if(name == 'camera') {
      genericModal = await this.modalCtrl.create({
        component: CameraPage,
      });
    } else if(name == 'location') {
      genericModal = await this.modalCtrl.create({
        component: LocationPage,
      });
    }
  
  
    genericModal.present();
    const { data, role } = await genericModal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  } 

  getUserAge(user: User) : string{
    return  moment().diff(user.dob, 'years');
  }

  async logout() {
    await this.firebaseService.signout().then(() => {
      this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl:true})
    })
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.gestureCtrlService.useSwiperGesture(cardArray);
  }

  async showAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: false
    })

    await alert.present();
  }

}