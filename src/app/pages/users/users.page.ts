import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { GestureCtrlService } from "src/app/providers/gesture-ctrl.service";
import { IonCard, ModalController } from "@ionic/angular";
import { DataService } from "../../providers/data.service";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";
import { FirebaseService } from "../services/old-firebase.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FbService } from "../services/fbService.service";
import { FilterPage } from "../filter/filter.page";
var moment = require('moment'); // require

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UsersPage implements OnInit {
 
  users!: User[];


  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  likeUsers: User[] = [];
  disLikeUsers: User[] = [];
  liked$!: Subscription;
  disLiked$!: Subscription;

  count$!: Observable<Number>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    public dataService: DataService,
    public angularFireAuth: AngularFireAuth,
    private fbService: FbService,
    private modalCtrl: ModalController,

    private cd: ChangeDetectorRef) {
      this.users = this.dataService.getUsers();
    }

    async openFilterModal() {
      const modal = await this.modalCtrl.create({
        component: FilterPage,
      });
      modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm') {
        console.log("confirmed");
        
      }
    }

    getUserAge(user: User) : string{
      return  moment().diff(user.dob, 'years');

    }
    
    ngOnInit() {

      this.angularFireAuth.authState.subscribe((user) => {
        if (user) {
          console.log(user);
          
        } else {
          console.log("Not logged in....");
          this.fbService.signOut();
        }
      });
      

      this.fbService.afAuth.authState.subscribe((user) => {
        if (user) {
          console.log(user.multiFactor['user']);
        } else {
          console.log("No user"); 
        }
      }); 
    }

    filterUsers() {
      console.log("Filtering..");
      
    }
    
    ngOnDestroy() {
      this.liked$.unsubscribe();
      this.disLiked$.unsubscribe();
    }
  
    ngAfterViewInit() {
      const cardArray = this.cards.toArray();
      this.gestureCtrlService.useSwiperGesture(cardArray);
    }
  }