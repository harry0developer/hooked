import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef
} from "@angular/core";

import { GestureCtrlService } from "src/app/service/gesture-ctrl.service";
import { AlertController, IonCard, LoadingController, ModalController } from "@ionic/angular";
import { BehaviorSubject } from 'rxjs';

import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { COLLECTION, MODALS, ROUTES, STORAGE } from "src/app/utils/const";
import { FirebaseService } from "src/app/service/firebase.service";
import { ChatService } from "src/app/service/chat.service";
import { LocationPage } from "../location/location.page";
import { CameraPage } from "../camera/camera.page";
import { UserModalPage } from "../user-modal/user-modal.page";
import { Auth } from "@angular/fire/auth";
import { MatchPage } from "../match/match.page";
import { Geo, Preferences, User } from "src/app/models/models";
import { LocationService } from "src/app/service/location.service";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

// TODO FILTER USERD
// LOCATION CALCULATE
export class UsersPage implements OnInit {
  users$;
  currentUser;
  defaultImage = '../../../assets/default/default.jpg';
  location: Geo;
  allUsers = [];
  users = [];
  usersWithDistance: User[] = [];
  toBeRemoved: any[] = [];
  usersLoaded$ = new BehaviorSubject(false);
  activeUser: User;
  distanceFilter = {
    min: 1,
    max: 120,
    value: 50
  };

  userPreferences: Preferences;

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
    private locationService: LocationService,
    public zone: NgZone,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef
  ){}
    
 async ngOnInit() {  
 
    this.getUserPreferences();
    //1. Get current logged in user
    await this.setCurrentUser();

    //2. Get all user
    await this.getAllUsers();

    //get user preferences
  
    // 3. Get location from storage
    // const location = this.firebaseService.getStorage(STORAGE.LOCATION);
    // if(!location || !location.lat || !location.lng) {
    //   this.openModal(SERVICE.LOCATION);
    // } 
    
  }
 
  async setCurrentUser() {
    await this.firebaseService.getCurrentUser().then((user: User) => {
      this.currentUser = user;
      this.firebaseService.setStorage(STORAGE.USER, user);
      if(!user.profile_picture) {
        this.showAlert("Incomplete profile", "Please add your profile picture before you can start swiping", "Go to profile")
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
      // console.log("Users", users);
      
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

        this.getUsersWithLocation(users);

        if(swipes.length < 1) {
          this.users = users;
          this.usersWithDistance = this.users.filter(u => parseInt(u.location.distance) < this.distanceFilter.value);
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
          this.usersWithDistance = this.users.filter(u => parseInt(u.location.distance) < this.distanceFilter.value);
          
        }
        console.log("User with D", this.usersWithDistance);
        console.log("Users", this.users);

        this.usersLoaded$.next(true);
      });

    });
        
  }

  getUserPreferences() {
    const prefs = this.firebaseService.getStorage(STORAGE.PREFERENCES);
    console.log("No prefs", prefs);
    if(prefs && prefs.distance) {
      this.userPreferences = prefs;
      this.distanceFilter.value = prefs.distance;
    } else {
      this.distanceFilter.value = 0;
      this.userPreferences = {
        distance: "0"
      }
    }
  
  }
  async getUsersWithLocation(users: User[]) {
    
    const loc = {lat: -26.004472, lng: 28.0042447};
    this.locationService.applyHaversine(users, loc.lat, loc.lng).forEach(u => {
      this.users = u;
    });
    console.log("WITH DISTANCE ", this.users);
    
  } 

  
  ngAfterViewInit() {
    this.cards.changes.subscribe(r =>{
      const cardArray = this.cards.toArray();      
      this.gestureCtrlService.useSwiperGesture(cardArray); 
    });
  }

  async updateUserPreference(pref: string) {    
    const loading = await this.loadingCtrl.create({message: "Applying filter..."});
    await loading.present();

    this.userPreferences.distance = pref;
    this.firebaseService.setUserPreferences(this.userPreferences).then(() => {
      console.log("User preference updated");
      this.distanceFilter.value = parseInt(pref);
      this.firebaseService.setStorage(STORAGE.PREFERENCES, this.userPreferences);
      this.usersWithDistance =  this.users.filter(u => parseInt(u.location.distance) < this.distanceFilter.value);
      this.cdr.detectChanges();
      loading.dismiss();
     });
  }
  
  pinFormatter(value: number) {
    return `${value} km`;
  }
  
 
  filterUsers() {
    console.log("Filtering..");
  }

  filterChange(event) {
    this.distanceFilter.value = event.detail.value;
  }

  applyDistanceFilter() {
    console.log("apply distance filter", this.distanceFilter.value);
    this.updateUserPreference(this.distanceFilter.value + "");
  }

  async openModal(name: string, user?) {
    let genericModal;
    if(name == MODALS.FILTER) {
      genericModal = await this.modalCtrl.create({
        component: FilterPage,
        componentProps: {
          "distance": this.userPreferences.distance
        }
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
    } else if(role === 'filter') {
      this.updateUserPreference(data);
      
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
      // initialBreakpoint: ,
      // breakpoints: [0, 1],
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