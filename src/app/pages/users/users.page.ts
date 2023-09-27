import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
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
import { Auth, user } from "@angular/fire/auth";
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
  users = [];
  toBeRemoved: any[] = [];
  usersLoaded$ = new BehaviorSubject(false);
  activeUser: User;

  mySwipes: any[] = [];

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    private firebaseService: FirebaseService,
    private router: Router,
    private auth: Auth,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef,
    public zone: NgZone
  ){}
    
 async ngOnInit() {  

    //1. Get current logged in user
    await this.setCurrentUser();

    //2. Get all user
    await this.getAllUsers();

  
    //3. Get location from storage
    // const location = this.firebaseService.getStorage(STORAGE.LOCATION);
    // if(!location || !location.lat || !location.lng) {
    //   this.openModal(SERVICE.LOCATION);
    // } 
  }
 
  async setCurrentUser() {
    await this.firebaseService.getCurrentUser().then((user: User) => {
      this.currentUser = user;
      console.log("Current ", this.currentUser);
      
      this.firebaseService.setStorage(STORAGE.USER, user);
      if(!user.profile_picture) {
        this.showAlert("Inclomplete profile", "Please add your profile picture before you can start swiping", "Go to profile")
      }
    }).catch(err => {
      console.log(err);
    });
  }


  async getAllUsers() {
    this.usersLoaded$.next(false);
    this.users = [];
    let usersEx = [];
    await this.chatService.getData(COLLECTION.USERS, 100).forEach(users => {
      console.log("Users", users);

      //I want list
      let wantList = [];
      users.forEach(u => {
        u.want.forEach(uw => {
          if(this.currentUser.want.includes(uw)) {
            wantList.push(u);
          }
        })
      });

      // With list 
      let withList = [];
      users.forEach(u => {
        u.with.forEach(uw => {
          if(this.currentUser.with.includes(uw)) {
            withList.push(u);
          }
        })
      });

      wantList = [...new Set(wantList)];
      withList = [...new Set(withList)];
      const filtered =  [...wantList, ...withList];
      users =[...new Set(filtered)];
      
      this.chatService.getMySwipes().forEach(s => {
        const swipes = [...s.swippers, ...s.swipped];

        if(swipes.length < 1) {
          this.users = users;
        } else {
          usersEx = users;
          //exclude swipped
          s.swipped.forEach(s => {    
            usersEx.forEach(u => {
              if(u.uid == s.swipperUid && s.match) {
                usersEx.splice(usersEx.indexOf(u), 1);
              } 
            })
          });

          // exclude swipper
          s.swippers.forEach(m => {    
            usersEx.forEach(u => {
              if(m.swippedUid === u.uid) {
                usersEx.splice(usersEx.indexOf(u), 1);
              }
            })
          });

          this.users = usersEx;
        }
        this.usersLoaded$.next(true);
      });

    });
        
  }

  async initMySwipes() {
    await this.firebaseService.getMySwippes().then(matches => {
      matches.forEach(matchedUsers => {
        matchedUsers.forEach(m => {
          this.users = this.allUsers.filter(u => u.uid !== m.swippedUid);
        });
      });
      if(this.users.length < 1) {
        this.users = this.allUsers;   
        
      }
      console.log("Users", this.users);
      this.usersLoaded$.next(true);
    }, () => {      
      this.usersLoaded$.next(true);
    });
  } 

  
  ngAfterViewInit() {
    this.cards.changes.subscribe(r =>{
      const cardArray = this.cards.toArray();      
      this.gestureCtrlService.useSwiperGesture(cardArray); 
    });
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
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
      this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true})
    });
  }
 
}