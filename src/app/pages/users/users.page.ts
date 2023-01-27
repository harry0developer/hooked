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
import { IonCard } from "@ionic/angular";
import { DataService } from "../../providers/data.service";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";
import { FirebaseService } from "../services/firebase.service";
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
    private firebaseService: FirebaseService,
    private cd: ChangeDetectorRef) {
      this.users = this.dataService.getUsers();
    }

    getUserAge(user: User) : string{
      return  moment().diff(user.dob, 'years');

    }
  
    ngOnInit() {

        
      

      this.firebaseService.afAuth.authState.subscribe((user) => {
        if (user) {
          console.log(user.multiFactor['user']);
          
          // this.userData = user;
          // localStorage.setItem('user', JSON.stringify(user));
          // JSON.parse(localStorage.getItem('user')!);
        } else {
          console.log("No user");
  
          // localStorage.setItem('user', 'null');
          // JSON.parse(localStorage.getItem('user')!);
        }
      });

      // this.liked$ = this.dataService.likedUser$.subscribe(user => {
      //   console.log(user);
      //   this.likeUsers.push(user);
      // });
      // this.disLiked$ = this.dataService.disLikedUser$.subscribe(user => {
      //   console.log(user);
      //   this.disLikeUsers.push(user);
      // });

      // this.count$ = this.dataService.userCount$;

      // this.cd.detectChanges()

      // this.dataService.userCount$.subscribe(c => {
      //   this.cd.detectChanges()
      // });
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