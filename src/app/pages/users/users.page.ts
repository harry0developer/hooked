import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy
} from "@angular/core";

import { GestureCtrlService } from "src/app/service/gesture-ctrl.service";
import { AlertController, IonCard, ModalController } from "@ionic/angular";
import { BehaviorSubject } from 'rxjs';

import { Geo, User } from '../../models/User';
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { ROUTES, SERVICE, STORAGE } from "src/app/utils/const";
import { FirebaseService } from "src/app/service/firebase.service";
import { ChatService } from "src/app/service/chat.service";
import { LocationPage } from "../location/location.page";
import { CameraPage } from "../camera/camera.page";
import { UserModalPage } from "../user-modal/user-modal.page";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users$;
  currentUser;
  defaultImage = '../../../assets/default/default.jpg';
  location: Geo;
  allUsers = [];
  usersLoaded$ = new BehaviorSubject(false);
  activeUser: User;

  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private chatService: ChatService,
  ){  }
    
  ngOnInit() { 


    this.gestureCtrlService.noLike$.subscribe(nl => {
      console.log(nl);
      
    });
    this.gestureCtrlService.like$.subscribe(like => {
      console.log(like);
      
    });
    //1. Get all user
    this.chatService.getUsers().forEach(r => {
      this.allUsers = r
      this.usersLoaded$.next(true)
    });

    //2. Get current logged in user
    this.firebaseService.getCurrentUser().then((user: User) => {
      this.currentUser = user;
      if(!user.profile_picture) {
        this.showAlert("Inclomplete profile", "Please add your profile picture before you can start swiping", "Go to profile")
      }
    }).catch(err => {
      console.log(err);
    });

    //3. Get location from storage
    const location = this.firebaseService.getStorage(STORAGE.LOCATION);
    if(!location || !location.lat || !location.lng) {
      this.openModal(SERVICE.LOCATION);
    } 
  }


  ngAfterViewInit() {
    //Add swipe gester after users have loaded
    this.cards.changes.subscribe(r => {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
      console.log(this.allUsers);
    })
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

  async showUserModal() {

    const modal = await this.modalCtrl.create({
      component: UserModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log("confirmed");
      
    }
  }

  async showAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: false
    })

    await alert.present();
    alert.onDidDismiss().then(() => {
      this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true})
    })
    
  }

}