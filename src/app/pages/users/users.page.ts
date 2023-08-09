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
import { BehaviorSubject, Observable, Subscribable, Subscription } from 'rxjs';

import { Geo, User } from '../../models/User';
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { COLLECTION, MODALS, ROUTES, SERVICE, STORAGE } from "src/app/utils/const";
import { FirebaseService } from "src/app/service/firebase.service";
import { ChatService } from "src/app/service/chat.service";
import { LocationPage } from "../location/location.page";
import { CameraPage } from "../camera/camera.page";
import { UserModalPage } from "../user-modal/user-modal.page";
import { Auth } from "@angular/fire/auth";
import { MatchPage } from "../match/match.page";
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

  matchUserSubscription$: Subscription;

  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    private firebaseService: FirebaseService,
    private router: Router,
    private auth: Auth,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private chatService: ChatService,
  ){}
    
  ngOnInit() {  

 
    // this.gestureCtrlService.unLiked$.subscribe(nl => {
    //   console.log(nl);
    // });
    // this.gestureCtrlService.like$.subscribe(like => {
    //   console.log(like);
    // });

    this.matchUserSubscription$ = this.firebaseService.aMatch$.subscribe(matchData => {
      if(matchData && matchData.uid) {
        console.log(matchData);
        
        this.openModal(MODALS.MATCH,  matchData)
      }
    })

    //1. Get all user
    let cachedUser = this.firebaseService.getStorage('users');

    if(cachedUser && cachedUser.length > 0 ) {
      // this.allUsers = cachedUser;
      console.log("Loaded cached users");
      for(let i of cachedUser) { 
        if(i.uid !== this.auth.currentUser.uid) {
          this.allUsers.push(i)
        }
      }

      this.usersLoaded$.next(true);
    } else {
      this.chatService.getUsers().forEach(r => {
        cachedUser = r;
        for(let i of cachedUser) { 
          if(i.uid !== this.auth.currentUser.uid) {
            this.allUsers.push(i)
          }
        }
        this.firebaseService.setStorage('users', r);
        this.usersLoaded$.next(true);
      });
    }

    


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
    // const location = this.firebaseService.getStorage(STORAGE.LOCATION);
    // if(!location || !location.lat || !location.lng) {
    //   this.openModal(SERVICE.LOCATION);
    // } 
  }

  ngOnDestroy() {
    this.matchUserSubscription$.unsubscribe();
  }


  ngAfterViewInit() {

    // console.log("After view init", this.cards);

    // if(this.cards && this.cards.length > 0 ) {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
    // }
    
    //Add swipe gester after users have loaded
    // this.cards.changes.subscribe(r => {
    //   console.log("Card changed ", r);
      
    //   const cardArray = this.cards.toArray();
    //   this.gestureCtrlService.useSwiperGesture(cardArray);
    //   console.log(this.allUsers);
    // })
  }
 
 
  filterUsers() {
    console.log("Filtering..");
  }


  async openModal(name: string, user?) {
    let genericModal;
    if(name == MODALS.FILTER) {
      genericModal = await this.modalCtrl.create({
        component: FilterPage,
      });
    }
    else if(name == MODALS.CAMERA) {
      genericModal = await this.modalCtrl.create({
        component: CameraPage,
      });
    } else if(name == MODALS.LOCATION) {
      genericModal = await this.modalCtrl.create({
        component: LocationPage,
      });
    }
    else if(name == MODALS.MATCH) {
      genericModal = await this.modalCtrl.create({
        component: MatchPage,
        componentProps: { 
          user,
          me: this.currentUser
        }
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
      this.router.navigateByUrl(ROUTES.AUTH, {replaceUrl:true})
    })
  }

  async showUserModal(user) {

    const modal = await this.modalCtrl.create({
      component: UserModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      componentProps: { 
        user
      }

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